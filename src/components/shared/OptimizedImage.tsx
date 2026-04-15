// components/shared/OptimizedImage.tsx
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean; // for above-the-fold images
}

export function OptimizedImage({
    src,
    alt,
    className,
    priority = false,
    ...props
}: OptimizedImageProps) {
    return (
        <img
            src={src}
            alt={alt}
            className={cn("w-full h-full object-cover", className)}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            crossOrigin=""
            style={{ imageRendering: "-webkit-optimize-contrast" }}
            {...props}
        />
    );
}