export function Avatar({
  name,
  photo,
  className = "h-12 w-12",
}: {
  name: string;
  photo?: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        loading="lazy"
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground ${className}`}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
