import { FunctionComponent } from "react"
import { FiBell } from "react-icons/fi"

export const NotificationBell: FunctionComponent<{ notifications: Array<any> }> = ({ notifications = [] }) => {
    return (
        <div className="dropdown border border-black p-3 rounded-full">
            <label tabIndex={0} className="btn rounded-full text-2xl w-14 h-14">
                <FiBell />
            </label>
            <ul tabIndex={0} className="hidden">
                <li><a>Item 1</a></li>
                <li><a>Item 2</a></li>
            </ul>
        </div>
    )
}