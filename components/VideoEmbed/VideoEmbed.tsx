// Responsive 16:9 YouTube embed.

export default function VideoEmbed({
  id,
  title,
}: {
  id: string;
  title?: string;
}) {
  return (
    <div className="video-embed">
      <iframe
        className="video-embed__frame"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title ?? "YouTube video player"}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
