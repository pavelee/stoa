import { FunctionComponent } from "react";
import Image from 'next/image';

export const Logo: FunctionComponent<{ imagePath: string, size: number }> = ({ imagePath, size }) => {
    return (
        <Image
            src={imagePath}
            width={size}
            height={size}
        />
    )
}