import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortableImageItemProps {
  id: string;
  image: string;
  index: number;
  onRemove: (index: number) => void;
}

export function SortableImageItem({ id, image, index, onRemove }: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group aspect-square touch-none ${isDragging ? "scale-105 shadow-xl" : ""}`}
    >
      <div className="w-full h-full rounded-lg overflow-hidden bg-muted border">
        <img
          src={image}
          alt={`Image ${index + 1}`}
          className="w-full h-full object-cover pointer-events-none"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </div>

      {/* First image badge */}
      {index === 0 && (
        <span className="absolute top-1 left-1 text-[9px] sm:text-[10px] bg-primary text-primary-foreground px-1 rounded z-10">
          Главное
        </span>
      )}

      {/* Drag handle - always visible for touch */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 right-1 bg-black/60 rounded p-1 cursor-grab active:cursor-grabbing z-10"
      >
        <GripVertical className="h-4 w-4 text-white" />
      </div>

      {/* Delete button */}
      <Button
        type="button"
        size="icon"
        variant="destructive"
        className="absolute bottom-1 right-1 h-7 w-7 sm:h-6 sm:w-6 z-10"
        onClick={() => onRemove(index)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
