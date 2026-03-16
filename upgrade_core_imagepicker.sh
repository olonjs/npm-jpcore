#!/bin/bash
set -e

echo "🎨 Upgrading Core: Injecting ImagePicker UI Shell..."

# 1. Aggiungiamo il componente UI Tabs (Shadcn)
mkdir -p packages/core/src/components/ui
echo "📦 Creating Tabs component..."
cat << 'END_OF_FILE' > packages/core/src/components/ui/tabs.tsx
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "../../lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900/50 p-1 text-zinc-400",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-zinc-800 data-[state=active]:text-white data-[state=active]:shadow",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
END_OF_FILE

# 2. Creiamo il Widget ImagePicker (UI Shell)
mkdir -p packages/core/src/admin/widgets
echo "📦 Creating ImagePicker Widget..."
cat << 'END_OF_FILE' > packages/core/src/admin/widgets/ImagePicker.tsx
import React, { useState } from 'react';
import { BaseWidgetProps } from '../../lib/shared-types';
import { useConfig } from '../../lib/ConfigContext';
import { resolveAssetUrl } from '../../utils/asset-resolver';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { ImageIcon, UploadCloud, Link as LinkIcon, Grid3X3, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

// MOCK DATA per la Library (Step 1)
const MOCK_LIBRARY = [
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  "https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=800&q=80",
];

export const ImagePicker: React.FC<BaseWidgetProps<string>> = ({ label, value, onChange }) => {
  const { tenantId = 'default' } = useConfig();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("library");
  const [tempLink, setTempLink] = useState(value || "");

  const resolvedUrl = value ? resolveAssetUrl(value, tenantId) : '';

  const handleSelect = (url: string) => {
    onChange(url);
    setOpen(false);
  };

  return (
    <div className="grid w-full gap-2 mb-4">
      <Label className="text-[9px] uppercase font-black tracking-widest text-zinc-500">
        {label}
      </Label>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-video bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all">
            {resolvedUrl ? (
              <>
                <img 
                  src={resolvedUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-medium text-white flex items-center gap-2">
                    <ImageIcon size={14} /> Change
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-2">
                <ImageIcon size={24} />
                <span className="text-[10px]">Select Image</span>
              </div>
            )}
          </div>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[600px] p-0 bg-zinc-950 border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
            <DialogHeader>
              <DialogTitle className="text-sm font-medium text-zinc-200">Media Manager</DialogTitle>
            </DialogHeader>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4 pt-2">
              <TabsList className="w-full justify-start bg-transparent border-b border-zinc-800 rounded-none h-auto p-0 gap-4">
                <TabsTrigger value="library" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-2">
                  <Grid3X3 size={14} className="mr-2" /> Library
                </TabsTrigger>
                <TabsTrigger value="upload" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-2">
                  <UploadCloud size={14} className="mr-2" /> Upload
                </TabsTrigger>
                <TabsTrigger value="link" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-2">
                  <LinkIcon size={14} className="mr-2" /> Direct Link
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB: LIBRARY */}
            <TabsContent value="library" className="p-4 h-[300px] overflow-y-auto custom-scrollbar focus-visible:ring-0 focus-visible:outline-none">
              <div className="grid grid-cols-3 gap-3">
                {MOCK_LIBRARY.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(url)}
                    className={cn(
                      "relative aspect-square rounded-md overflow-hidden border border-zinc-800 hover:border-blue-500 transition-all group",
                      value === url && "ring-2 ring-blue-500 border-transparent"
                    )}
                  >
                    <img src={url} className="w-full h-full object-cover" alt="" />
                    {value === url && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="bg-blue-500 rounded-full p-1">
                          <Check size={12} className="text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </TabsContent>

            {/* TAB: UPLOAD */}
            <TabsContent value="upload" className="p-4 h-[300px] flex flex-col items-center justify-center focus-visible:ring-0 focus-visible:outline-none">
              <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center gap-4 hover:border-zinc-700 hover:bg-zinc-900/30 transition-colors cursor-pointer">
                <div className="p-4 rounded-full bg-zinc-900">
                  <UploadCloud size={32} className="text-zinc-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-zinc-300">Click or drag file to upload</p>
                  <p className="text-xs text-zinc-500 mt-1">SVG, PNG, JPG or GIF (max. 2MB)</p>
                </div>
                <Button variant="outline" size="sm" className="mt-2">Select File</Button>
              </div>
            </TabsContent>

            {/* TAB: LINK */}
            <TabsContent value="link" className="p-4 h-[300px] focus-visible:ring-0 focus-visible:outline-none">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Image URL</Label>
                  <Input 
                    value={tempLink} 
                    onChange={(e) => setTempLink(e.target.value)} 
                    placeholder="https://..." 
                    className="bg-zinc-900"
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleSelect(tempLink)}
                  disabled={!tempLink}
                >
                  Use this URL
                </Button>
                
                {tempLink && (
                  <div className="mt-4 rounded-lg border border-zinc-800 overflow-hidden aspect-video bg-black">
                    <img src={tempLink} className="w-full h-full object-contain" alt="Preview" />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};
END_OF_FILE

# 3. Aggiorniamo InputRegistry per usare il nuovo Widget
echo "remember to  Update InputRegistry..."


echo "✅ Core upgraded with ImagePicker UI Shell."
