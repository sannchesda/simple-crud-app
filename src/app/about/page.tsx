import Image from "next/image";
export default function About() {
    return (
        <div className="container">
            Something here
            <Image
                className="dark:invert"
                src="/next.svg"
                alt="Next.js logo"
                width={180}
                height={38}
                priority
            />
        </div>
    );
}