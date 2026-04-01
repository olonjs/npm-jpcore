import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import type { PlaywrightBridge } from "./bridge.js";

export class OlonJsMcpServer {
  private server: Server;

  constructor(private bridge: PlaywrightBridge) {
    this.server = new Server(
      {
        name: "@olonjs/mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
          resources: {}, // Enabling resources so Agent can read olon:// URIs
        },
      }
    );

    this.setupHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.bridge.disconnect();
      await this.server.close();
      process.exit(0);
    });
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      try {
        const webMcpTools = await this.bridge.listTools();
        return {
          tools: webMcpTools.map((t) => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema as any, // MCP SDK expects specific types but general JSON schema is supported
          })),
        };
      } catch (err: any) {
        console.error("Failed to list tools:", err);
        return { tools: [] };
      }
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;
        const resultString = await this.bridge.executeTool(name, JSON.stringify(args || {}));
        const parsed = JSON.parse(resultString);
        
        return {
          content: parsed.content || [{ type: "text", text: resultString }],
          isError: parsed.isError || false,
        };
      } catch (err: any) {
        return {
          content: [{ type: "text", text: `Error calling tool: ${err.message}` }],
          isError: true,
        };
      }
    });

    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: "olon://pages/home",
            name: "Home Page Data",
            description: "JSON data of the Home page. To fetch other pages, append the slug, e.g. olon://pages/about",
            mimeType: "application/json",
          }
        ]
      }
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      try {
        const uri = request.params.uri;
        if (!uri.startsWith("olon://")) {
          throw new Error(`Unsupported URI schema: ${uri}. Only olon:// is supported.`);
        }

        const dataString = await this.bridge.readResource(uri);
        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: dataString,
            },
          ],
        };
      } catch (err: any) {
        console.error("Failed to read resource:", err);
        throw err;
      }
    });
  }

  async run() {
    console.error("[OlonJsMcpServer] Connecting to WebMCP via Playwright...");
    await this.bridge.connect();
    
    console.error("[OlonJsMcpServer] WebMCP connected. Starting STDIO transport...");
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("[OlonJsMcpServer] MCP Server is running and listening on STDIO.");
  }
}
