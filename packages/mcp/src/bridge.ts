import { chromium, Browser, Page } from 'playwright';

export interface WebMcpToolInfo {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export class PlaywrightBridge {
  private browser: Browser | null = null;
  public page: Page | null = null;

  constructor(
    public targetUrl: string,
    private privateKey?: string
  ) {}

  async connect() {
    console.error(`[PlaywrightBridge] Launching browser...`);
    this.browser = await chromium.launch({ headless: true });
    
    const context = await this.browser.newContext();
    this.page = await context.newPage();

    console.error(`[PlaywrightBridge] Navigating to ${this.targetUrl}...`);
    await this.page.goto(this.targetUrl, { waitUntil: 'domcontentloaded' });

    // Try to handle Crypto Auth Wall if it exists
    if (this.privateKey) {
      try {
        // We wait a bit to see if an auth input appears.
        // In the future, this selector should match the OlonJS AdminGuard.
        const authInputSelector = 'input[type="password"]'; 
        const authButtonSelector = 'button:has-text("Authenticate")';

        const isAuthWall = await this.page.locator(authInputSelector).isVisible({ timeout: 2000 }).catch(() => false);
        
        if (isAuthWall) {
          console.error(`[PlaywrightBridge] Auth wall detected. Injecting private key...`);
          await this.page.fill(authInputSelector, this.privateKey);
          await this.page.click(authButtonSelector);
        }
      } catch (err) {
        console.error(`[PlaywrightBridge] Error during auth bypass:`, err);
      }
    }

    console.error(`[PlaywrightBridge] Waiting for WebMCP to initialize...`);
    
    // Wait for the navigator.modelContextProtocol to become available
    await this.page.waitForFunction(() => {
      return (window.navigator as any).modelContextProtocol !== undefined;
    }, undefined, { timeout: 15000 }).catch(() => {
      throw new Error("Timeout waiting for navigator.modelContextProtocol. Ensure you are navigating to an OlonJS Studio route (e.g. /admin) and WebMCP is enabled.");
    });

    console.error(`[PlaywrightBridge] Connected to WebMCP successfully.`);
  }

  async listTools(): Promise<WebMcpToolInfo[]> {
    if (!this.page) throw new Error("Not connected");
    return this.page.evaluate(() => {
      return (window.navigator as any).modelContextProtocol.listTools();
    });
  }

  async readResource(uri: string): Promise<string> {
    if (!this.page) throw new Error("Not connected");
    return this.page.evaluate(async (targetUri) => {
      return (window.navigator as any).modelContextProtocol.readResource(targetUri);
    }, uri);
  }

  async executeTool(toolName: string, inputArgsJson: string): Promise<string> {
    if (!this.page) throw new Error("Not connected");
    return this.page.evaluate(async ({ name, args }) => {
      return (window.navigator as any).modelContextProtocol.executeTool(name, args);
    }, { name: toolName, args: inputArgsJson });
  }

  async navigateTo(slug: string): Promise<void> {
    if (!this.page) throw new Error("Not connected");
    const baseUrl = this.targetUrl.replace(/\/admin.*$/, '');
    const targetUrl = `${baseUrl}/admin/${slug}`;
    console.error(`[PlaywrightBridge] Navigating to ${targetUrl}...`);
    await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await this.page.waitForFunction(() => {
      return (window.navigator as any).modelContextProtocol !== undefined;
    }, undefined, { timeout: 15000 }).catch(() => {
      throw new Error(`Timeout waiting for WebMCP on /admin/${slug}.`);
    });
    console.error(`[PlaywrightBridge] Now on slug: ${slug}`);
  }

  async disconnect() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      console.error(`[PlaywrightBridge] Disconnected.`);
    }
  }
}
