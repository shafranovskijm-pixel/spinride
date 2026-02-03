import { useState, useRef } from "react";
import { Upload, Loader2, X, Camera, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { compressImage, formatFileSize, getCompressionRatio } from "@/lib/image-compression";

interface SingleImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  label?: string;
}

export function SingleImageUpload({
  imageUrl,
  onImageChange,
  bucket = "product-images",
  folder = "banners",
  label = "Изображение",
}: SingleImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [urlInput, setUrlInput] = useState("");

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Файл должен быть изображением");
      return;
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Файл слишком большой (макс. 20 МБ)");
      return;
    }

    setIsUploading(true);
    setUploadProgress("Сжатие...");

    try {
      const originalSize = file.size;

      // Compress the image
      let compressedFile = file;
      try {
        compressedFile = await compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.9,
          mimeType: "image/webp",
        });
      } catch (compressError) {
        console.warn("Compression failed, using original:", compressError);
      }

      // Generate unique filename
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
      const filePath = `${folder}/${fileName}`;

      setUploadProgress("Загрузка...");

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, compressedFile, {
          cacheControl: "31536000",
          upsert: false,
          contentType: "image/webp",
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onImageChange(urlData.publicUrl);

      const savedBytes = originalSize - compressedFile.size;
      const ratio = getCompressionRatio(originalSize, compressedFile.size);
      toast.success(`Загружено! Сжато на ${ratio}% (${formatFileSize(savedBytes)})`);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Ошибка загрузки");
    } finally {
      setIsUploading(false);
      setUploadProgress("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    }
  };

  const handleUrlAdd = () => {
    if (!urlInput.trim()) return;

    if (!urlInput.startsWith("http")) {
      toast.error("URL должен начинаться с http:// или https://");
      return;
    }

    onImageChange(urlInput.trim());
    setUrlInput("");
    toast.success("Изображение добавлено");
  };

  const handleRemove = async () => {
    // If it's a storage URL, try to delete from storage
    if (imageUrl.includes(bucket)) {
      try {
        const urlParts = imageUrl.split(`/${bucket}/`);
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await supabase.storage.from(bucket).remove([filePath]);
        }
      } catch (error) {
        console.error("Failed to delete from storage:", error);
      }
    }

    onImageChange("");
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>

      {imageUrl ? (
        <div className="relative rounded-lg overflow-hidden border bg-muted/50">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-40 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="camera" className="flex items-center gap-1 text-xs">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Камера</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-1 text-xs">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Файл</span>
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-1 text-xs">
              <LinkIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Ссылка</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="mt-3">
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full h-24 border-dashed flex-col gap-2"
              onClick={() => cameraInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-sm">{uploadProgress}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Camera className="h-6 w-6" />
                  <span className="text-sm">Сфотографировать</span>
                </div>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="upload" className="mt-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full h-24 border-dashed flex-col gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-sm">{uploadProgress}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-6 w-6" />
                  <span className="text-sm">Выбрать файл</span>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP • Автосжатие
                  </span>
                </div>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="url" className="mt-3">
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleUrlAdd();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleUrlAdd}
                disabled={!urlInput.trim()}
              >
                OK
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
