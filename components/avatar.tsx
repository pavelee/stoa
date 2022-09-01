import { FunctionComponent, useEffect, useState } from "react"
import { User } from "../entity/user"
import { useUser } from "../services/useUser"
import Image from 'next/image';

export const Avatar: FunctionComponent<{ user: User, size: number }> = ({ user, size = 10 }) => {
    return (
        <div className="cursor-pointer">
            <div className={`bg-neutral-focus text-neutral-content rounded-full`}>
                {/* <span className="text-xl">{text}</span> */}
                {
                    user && <div className="shadow-sm">
                        <img className="rounded-tl-xl border border-yellow-500 rounded-tr-xl" src={process.env.NEXT_PUBLIC_FILES_HOST + user.avatar} height={size * 5} width={size * 5} />
                        {/* <div>
                            <Image
                                src={user.avatar}
                                height={size * 10}
                                width={size * 10}
                                className="rounded-tl-xl border border-yellow-500 rounded-tr-xl"
                            />
                        </div> */}
                        {/* <div className="absolute bottom-0 text-white bg-yellow-500 rounded-full text-center">425</div> */}
                        <div className="text-white bg-yellow-500 text-center rounded-bl-xl rounded-br-xl">{user.points}</div>
                    </div>
                }
            </div>
        </div>
    )
}