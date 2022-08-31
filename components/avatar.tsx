import { FunctionComponent, useState } from "react"
import { User } from "../entity/user"
import { useUser } from "../services/useUser"

export const Avatar: FunctionComponent<{ user: User, size: number }> = ({ user, size = 10 }) => {
    const [avataSize, setAvatarSize] = useState(size);
    return (
        <div className="cursor-pointer">
            <div className={`bg-neutral-focus text-neutral-content rounded-full w-${avataSize} h-${avataSize}`}>
                {/* <span className="text-xl">{text}</span> */}
                {
                    user && <div className="shadow-sm">
                        <img className="rounded-tl-xl border border-yellow-500 rounded-tr-xl" src={user.avatar} />
                        {/* <div className="absolute bottom-0 text-white bg-yellow-500 rounded-full text-center">425</div> */}
                        <div className="text-white bg-yellow-500 text-center rounded-bl-xl rounded-br-xl">{user.points}</div>
                    </div>
                }
            </div>
        </div>
    )
}