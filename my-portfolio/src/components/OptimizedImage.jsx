export default function OptimizedImage({image,alt='',sizes='100vw',priority=false,eager=false,className='',...props}) {
  if(!image) return null;
  const srcset=items=>items?.map(item=>`${item.src} ${item.width}w`).join(', ');
  return <picture>
    {image.sources?.avif?.length>0 && <source type="image/avif" srcSet={srcset(image.sources.avif)} sizes={sizes} />}
    {image.sources?.webp?.length>0 && <source type="image/webp" srcSet={srcset(image.sources.webp)} sizes={sizes} />}
    <img {...props} src={image.src} srcSet={srcset(image.sources?.fallback)} sizes={sizes} width={image.width} height={image.height} alt={alt} loading={priority||eager?'eager':'lazy'} fetchPriority={priority?'high':undefined} decoding="async" className={className} />
  </picture>;
}
