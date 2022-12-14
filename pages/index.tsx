import type { NextPage } from 'next'
import Image from 'next/image';
import { FunctionComponent, useState } from 'react';
import { FiBell } from 'react-icons/fi'
import { FcLikePlaceholder } from 'react-icons/fc';
import { fetchData, Topic } from '../entity/topic';
import { Logo } from '../components/logo';
import { PointCounter } from '../components/pointCounter';
import { NotificationBell } from '../components/notificationBell';
import { Avatar } from '../components/avatar';
import { IdeaCard } from '../components/ideacard';
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../services/session';
import { useUser } from '../services/useUser';
import { addTopic, getTopic } from '../services/api';
import Router from 'next/router';
import { config } from '../appconfig';
import { translate } from '../services/translate';
import { getRedisClient } from '../services/redis';
import { fetchByIdData, userSchema } from '../entity/user';

const InputIdeaCard: FunctionComponent<{ placeholder: string }> = ({ placeholder = "What's on your mind?" }) => {
  return (
    <div className="bg-white shadow-xl p-5 rounded-xl">
      <div className="flex gap-5">
        {/* <Avatar /> */}
        <textarea className="flex-auto p-3 bg-gray-200 text-gray-600 rounded-xl h-14" placeholder={placeholder}></textarea>
      </div>
    </div>
  )
}

const NewThread: FunctionComponent<{ user: any, addThread: any, placeholder: string }> = ({ user, addThread, placeholder = '' }) => {
  const [content, setContent] = useState('');

  return (
    <form onSubmit={(ev) => {
      ev.preventDefault();
      addThread(content);
    }} className="bg-white rounded-xl p-5 transition-all duration-300">
      <div className="flex gap-3">
        <div>
          <Avatar user={user} size={10} />
        </div>
        <div className="flex-auto">
          <textarea required className="bg-gray-200 w-full p-3 rounded-xl placeholder-gray-400" onChange={(ev) => { setContent(ev.target.value) }} placeholder={placeholder}></textarea>
        </div>
      </div>
      <div className={'mt-3 flex justify-center items-center ' + (!content ? 'hidden' : '')}>
        <input type="submit" className="text-white p-3 shadow-xl rounded-xl bg-gradient-to-r from-blue-400 to-blue-500 w-1/4" />
      </div>
    </form>
  )
}

const Home: NextPage = ({ topics, user }: any) => {
  // const { user } = useUser();

  const addThread = async (content: string) => {
    let topic = await addTopic(content);
    if (topic) {
      Router.reload();
      // @TODO brainstorm about process
      // Router.push(`/topic/${topic.id}`);
    }
  }

  return (
    <div>
      <div className="rounded-xl shadow-xl bg-gradient-to-r from-blue-300 to-blue-500 p-5 text-white mb-3 text-center text-xl">
        <h2>Anga??uj si?? ???????????????? zdobywaj wipCoiny ???? wymieniaj na nagody ????</h2>
      </div>
      {
        user && <div className="mb-3">
          <NewThread user={user} addThread={addThread} placeholder={translate('NEW_THREAT_PLACEHOLDER', config.language)} />
        </div>
      }
      <div className="space-y-3">
        {
          topics.map((topic: Topic) => {
            return (
              <IdeaCard key={topic.entityId} t={topic} u={user} nolikeText={translate('NOLIKE', config.language)} likedText={translate('LIKED', config.language)} likeText={translate('LIKE', config.language)} commentText={translate('COMMENT', config.language)} viewText={translate('VIEW', config.language)} commentPlaceholder={translate('COMMENT_PLACEHOLDER', config.language)} doCommentText={translate('DO_COMMENT', config.language)} signInCommentText={translate('SIGN_IN_COMMENT', config.language)} signInToLikeText={translate('SIGN_IN_LIKE', config.language)} noCommentYetText={translate('NO_COMMENTS_YET', config.language)} />
            );
          })
        }
      </div>
    </div >
  )
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  let user = null;
  if (req.session.user) {
    user = req.session.user;
    try {
      user = await fetchByIdData(user.entityId);
    } catch (e: any) {
      req.session.destroy();
    }
  }

  let data = await fetchData(null, user);

  return {
    props: {
      user: user,
      topics: data,
    }, // will be passed to the page component as props
  }
},
  sessionOptions)

export default Home
