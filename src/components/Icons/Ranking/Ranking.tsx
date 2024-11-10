import Image from "next/image";

export function Ranking() {
  return (
    <Image
      src="/icons/ranking.png"
      width={43}
      height={55}
      alt="icon"
      priority={true}
    />
  );
}
