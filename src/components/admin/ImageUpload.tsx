import { useState, useRef } from "react";
import { Upload, Loader2, ImageIcon, Link as LinkIcon, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableImageItem } from "./SortableImageItem";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState("");

  const uploadFiles = async (files: FileList) => {
    if (images.length + files.length > maxImages) {
      toast({
        title: "Слишком много изображений",
        description: `Максимум ${maxImages} изображений`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const newImages: string[] = [];
    const totalFiles = files.length;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Неверный формат",
            description: `${file.name} не является изображением`,
            variant: "destructive",
          });
          continue;
        }

        // Validate file size (max 10MB for camera photos)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "Файл слишком большой",
            description: `${file.name} больше 10 МБ`,
            variant: "destructive",
          });
          continue;
        }

        // Generate unique filename
        const ext = file.name.split(".").pop() || "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const filePath = `products/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Upload error:", error);
          toast({
            title: "Ошибка загрузки",
            description: error.message,
            variant: "destructive",
          });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        newImages.push(urlData.publicUrl);
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
        toast({
          title: "Изображения загружены",
          description: `Загружено ${newImages.length} файл(ов)`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось загрузить изображения",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    await uploadFiles(files);
  };

  const addImageUrl = () => {
    if (!imageUrl.trim()) return;
    
    if (!imageUrl.startsWith("http")) {
      toast({
        title: "Неверный URL",
        description: "URL должен начинаться с http:// или https://",
        variant: "destructive",
      });
      return;
    }

    if (images.length >= maxImages) {
      toast({
        title: "Слишком много изображений",
        description: `Максимум ${maxImages} изображений`,
        variant: "destructive",
      });
      return;
    }

    onImagesChange([...images, imageUrl.trim()]);
    setImageUrl("");
  };

  const removeImage = async (index: number) => {
    const imageToRemove = images[index];
    
    // If it's a storage URL, try to delete from storage
    if (imageToRemove.includes("product-images")) {
      try {
        const urlParts = imageToRemove.split("/product-images/");
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await supabase.storage.from("product-images").remove([filePath]);
        }
      } catch (error) {
        console.error("Failed to delete from storage:", error);
      }
    }

    onImagesChange(images.filter((_, i) => i !== index));
  };

  // Sensors for dnd-kit - touch support is crucial for mobile
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img === active.id);
      const newIndex = images.findIndex((img) => img === over.id);
      onImagesChange(arrayMove(images, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="camera" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="camera" className="flex items-center gap-1 text-xs sm:text-sm">
            <Camera className="h-4 w-4" />
            <span className="hidden sm:inline">Камера</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-1 text-xs sm:text-sm">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Файлы</span>
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-1 text-xs sm:text-sm">
            <LinkIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Ссылка</span>
          </TabsTrigger>
        </TabsList>

        {/* Camera capture - optimized for mobile */}
        <TabsContent value="camera" className="space-y-3">
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
            className="w-full h-28 sm:h-24 border-dashed flex-col gap-2"
            onClick={() => cameraInputRef.current?.click()}
            disabled={isUploading || images.length >= maxImages}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm">Загрузка... {uploadProgress}%</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Camera className="h-8 w-8" />
                <span className="text-sm font-medium">Сфотографировать товар</span>
                <span className="text-xs text-muted-foreground">
                  Откроется камера телефона
                </span>
              </div>
            )}
          </Button>
        </TabsContent>

        {/* File upload */}
        <TabsContent value="upload" className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Button
            type="button"
            variant="outline"
            className="w-full h-24 border-dashed"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || images.length >= maxImages}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm">Загрузка... {uploadProgress}%</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-6 w-6" />
                <span className="text-sm">Выбрать файлы</span>
                <span className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP до 10 МБ
                </span>
              </div>
            )}
          </Button>
        </TabsContent>

        {/* URL input */}
        <TabsContent value="url" className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="text-base"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImageUrl();
                }
              }}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={addImageUrl}
              disabled={!imageUrl.trim() || images.length >= maxImages}
            >
              Добавить
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Image previews with drag-and-drop */}
      {images.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
              {images.map((img, index) => (
                <SortableImageItem
                  key={img}
                  id={img}
                  image={img}
                  index={index}
                  onRemove={removeImage}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {images.length === 0 && (
        <div className="text-center py-4 sm:py-6 text-muted-foreground">
          <ImageIcon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Нет изображений</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-right">
        {images.length} из {maxImages} изображений
      </p>
    </div>
  );
}
