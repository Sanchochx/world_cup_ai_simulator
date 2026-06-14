interface Props {
  code: string;
  size?: 20 | 40 | 80;
  className?: string;
}

export default function FlagImage({ code, size = 40, className = '' }: Props) {
  return (
    <img
      src={`https://flagcdn.com/w${size}/${code}.png`}
      alt={code.toUpperCase()}
      width={size}
      height={Math.round(size * 0.75)}
      className={`inline-block rounded-sm object-cover ${className}`}
    />
  );
}
