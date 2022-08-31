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

const NewThread: FunctionComponent<{ user: any, addThread: any }> = ({ user, addThread }) => {
  const [content, setContent] = useState('');

  return (
    <form onSubmit={(ev) => {
      ev.preventDefault();
      addThread(content);
    }} className="bg-white rounded-xl p-5 transition-all duration-300">
      <div className="flex gap-3">
        <div>
          <Avatar user={user} />
        </div>
        <div className="flex-auto">
          <textarea required className="bg-gray-200 w-full p-3 rounded-xl placeholder-gray-400" onChange={(ev) => { setContent(ev.target.value) }} placeholder={"What's on your mind?"}></textarea>
        </div>
      </div>
      <div className={'mt-3 flex justify-center items-center ' + (!content ? 'hidden' : '')}>
        <input type="submit" className="bg-blue-400 text-white p-3 shadow-sm rounded-xl font-bold w-1/4" />
      </div>
    </form>
  )
}

const Home: NextPage = ({ topics, user }: any) => {

  const addThread = async (content: string) => {
    let topic = await addTopic(content);
    if (topic) {
      Router.push(`/topic/${topic.id}`);
    }
  }

  return (
    <div>
      {
        user && <div className="mb-3">
          <NewThread user={user} addThread={addThread} />
        </div>
      }
      <div className="space-y-3">
        {
          topics.map((topic: Topic) => {
            return (
              <IdeaCard key={topic.entityId} t={topic} u={user} />
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
