import { FunctionComponent, useEffect, useState } from "react"
import { FcLike, FcLikePlaceholder } from "react-icons/fc"
import { Topic } from "../entity/topic"
import { Avatar } from "./avatar"
import Link from 'next/link';
import { addComment, addLike, getLike, getTopic, removeLike } from "../services/api";
import moment from 'moment';

export const ReactionList: FunctionComponent<{ reactions: any, reactionName: string, isShow: boolean, setIsShow: any }> = ({ reactions, reactionName, isShow, setIsShow }) => {
    return (
        <div>
            <span onClick={() => { setIsShow(!isShow) }}>{reactions.length} {reactionName}</span>
            <div className={'z-50 bg-white border border-gray-200 rounded-xl shadow-sm absolute flex flex-col gap-3 p-3 w-80 overflow-scroll max-h-64 ' + (!isShow ? 'hidden' : '')}>
                <div onClick={() => { setIsShow(false); }} className="text-right h-2">x</div>
                {reactions.map((reaction: any) => (
                    <div className="flex gap-3 justify-center items-center">
                        <div>
                            <Avatar user={reaction.author} size={10} />
                        </div>
                        <div>
                            {reaction.author.name}
                        </div>
                        <div className="text-gray-400">
                            {moment(reaction.created).fromNow()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export const Comment: FunctionComponent<{ comment: any, toggleLike: any, likeText: string }> = ({ comment, toggleLike, likeText = '' }) => {
    const [isShowLikes, setIsShowLikes] = useState(false);
    return (
        <div className="flex gap-1 p-3 relative" >
            <div className="flex">
                <Avatar user={comment.author} size={10} />
            </div>
            <div className="flex-auto">
                <div className="bg-gray-200 rounded-lg p-3">
                    <div className="font-bold">{comment.author.name}</div>
                    <div>{comment.content}</div>
                </div>
                <div className="flex gap-2">
                    <div className="text-2xl" onClick={() => { toggleLike(comment) }}>
                        {!comment.isLiked && <FcLikePlaceholder className="hover:animate-bounce" />}
                        {comment.isLiked && <FcLike className="animate-bounce" />}
                    </div>
                    <div>
                        <ReactionList reactions={comment.likes} reactionName={likeText} isShow={isShowLikes} setIsShow={setIsShowLikes} />
                    </div>
                </div>
            </div>
            <div className="text-gray-400 text-sm absolute right-5">
                {moment(comment.created).fromNow()}
            </div>
        </div >
    )
}

export const IdeaCard: FunctionComponent<{ t: any, u: any, nolikeText: string, likedText: string, likeText: string, commentText: string, viewText: string, commentPlaceholder: string, doCommentText: string, signInCommentText: string, signInToLikeText: string, noCommentYetText: string }> = ({ t, u, nolikeText = '', likedText = '', likeText = '', commentText = '', viewText = '', commentPlaceholder = '', doCommentText = '', signInCommentText = '', signInToLikeText = '', noCommentYetText = ''  }) => {
    const [topic, setTopic] = useState(t);
    const [isShowLikes, setIsShowLikes] = useState(false);
    const [isShowComments, setIsShowComments] = useState(false);
    const [isShowViews, setIsShowViews] = useState(false);
    const [userComment, setUserComment] = useState('');

    const toggleLike = async () => {
        if (topic.isLiked) {
            await removeLike('topic', topic.id);
            await refreshTopic();
        } else {
            await addLike('topic', topic.id);
            await refreshTopic();
        }
    }

    const toggleLikeComment = async (comment: any) => {
        if (comment.isLiked) {
            await removeLike('comment', comment.id);
            await refreshTopic();
        } else {
            await addLike('comment', comment.id);
            await refreshTopic();
        }
    }

    const doComment = async (content: string) => {
        if (content) {
            await addComment('topic', topic.id, content);
            await refreshTopic();
        }
    }

    const refreshTopic = async () => {
        let data = await getTopic(t.id);
        if (data) {
            setTopic(data);
        }
    }

    return (
        <div className="bg-white shadow-xl rounded-lg cursor-pointer p-5">
            {/* <figure><img src="https://placeimg.com/1920/1080/arch" alt="Shoes" /></figure> */}
            <div className="flex gap-3">
                <div>
                    <Avatar user={topic.author} size={10} />
                </div>
                <div className="flex flex-col">
                    <div>{topic.author.name}</div>
                    <div className="text-gray-500">
                        <Link
                            href={`/topic/${topic.id}`}
                        >
                            <a className="bg-blue-100 p-1 rounded-xl shadow-sm">
                                {moment(topic.created).fromNow()}
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 mt-3">
                <div>
                    <p className="pt-2 pb-2">{topic.content}</p>
                </div>
            </div>
            <div className="flex flex-row gap-3 mt-3 text-gray-500">
                <ReactionList reactions={topic.likes} reactionName={likeText} isShow={isShowLikes} setIsShow={setIsShowLikes} />
                <ReactionList reactions={topic.comments} reactionName={commentText} isShow={isShowComments} setIsShow={setIsShowComments} />
                <ReactionList reactions={topic.views} reactionName={viewText} isShow={isShowViews} setIsShow={setIsShowViews} />
            </div>
            <hr className="mt-3" />
            <div className="flex mt-3 gap-5 items-center">
                <div className="text-3xl" onClick={() => { toggleLike() }}>
                    {!topic.isLiked && <FcLikePlaceholder className="hover:animate-bounce" />}
                    {topic.isLiked && <FcLike className="animate-bounce" />}
                </div>
                <div>
                    {!topic.isLiked &&
                        <div className="flex gap-1">
                            <div>
                                {nolikeText}
                            </div>
                            {!u && <div><Link href={'login'}><a className="underline text-blue-500">{signInToLikeText}</a></Link></div>}
                        </div>
                    }
                    {topic.isLiked && <span>{likedText}</span>}
                </div>
            </div>
            <hr className="mt-3 mb-3" />
            <div className="flex flex-col">
                <div>
                    {topic.comments.length <= 0 && <div className="flex justify-center items-center">
                        <span className="text-gray-500">{noCommentYetText}</span>
                    </div>}
                    {topic.comments.map((comment: any) => {
                        return (
                            <Comment key={comment.id} comment={comment} toggleLike={toggleLikeComment} likeText={likeText} />
                        )
                    })}
                </div>
                <div>
                    <hr className="mt-3 mb-3" />
                </div>
                {
                    u && <div className="flex gap-3 justify-center items-center">
                        <Avatar user={u} size={10} />
                        <textarea onChange={(ev) => { setUserComment(ev.target.value) }} className="bg-gray-100 flex-auto rounded-sm shadow-sm p-3 placeholder-gray-400" placeholder={commentPlaceholder}></textarea>
                        <button onClick={() => { doComment(userComment) }} className="text-white p-3 shadow-xl rounded-xl bg-gradient-to-r from-blue-400 to-blue-500  text-center">{doCommentText}</button>
                    </div>
                }
                {
                    !u && <div className="flex justify-center items-center">
                        <Link
                            href={'/login'}
                        >
                            <button className="text-white p-3 shadow-xl rounded-xl bg-gradient-to-r from-blue-400 to-blue-500 w-1/2 text-center w-1/4">{signInCommentText}</button>
                        </Link>
                    </div>
                }
            </div>
        </div>
    )
}