import '../styles/globals.css'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Logo } from '../components/logo';
import { PointCounter } from '../components/pointCounter';
import { NotificationBell } from '../components/notificationBell';
import { FunctionComponent, useState } from 'react';
import { useUser } from '../services/useUser';
import { Avatar } from '../components/avatar';
import Link from 'next/link';
import { logout } from '../services/api';
import Router from 'next/router'
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../services/session';

const UserInfo: FunctionComponent<{ user: any }> = ({ user }) => {
  return (
    <div className="bg-white flex justify-center items-center rounded-xl shadow-xl p-5">
      <div className="flex-col">
        <div className="cursor-pointer flex justify-center">
          <Avatar user={user} size={36} />
        </div>
        <div className="text-center mt-3 text-xl">
          {user.name}
        </div>
      </div>
    </div>
  );
}

const AvatarMenu: FunctionComponent<{ user: any, doLogout: any }> = ({ user, doLogout }) => {
  const [isShowMenu, setIsShowMenu] = useState(false);
  return (<>
    {
      user &&
      <div className="relative">
        <div onClick={() => { setIsShowMenu(!isShowMenu); }}>
          <Avatar user={user} />
        </div>
        <div className={'bg-white p-5 border rounded-xl -left-10 border-black absolute ' + (!isShowMenu ? 'hidden' : '')}>
          <div className="text-blue-600 cursor-pointer" onClick={() => { doLogout() }}>singout</div>
        </div>
      </div>
    }
    {
      !user && <Link href={'/login'}><a className="bg-blue-200 p-2 rounded-xl shadow-sm">Sign in</a></Link>
    }
  </>)
}

function MyApp({ Component, pageProps }: AppProps) {
  console.log(pageProps);
  const doLogout = async () => {
    await logout();
    Router.reload();
  }

  // const { user } = useUser();
  const user = pageProps.user;
  return (
    <div>
      <Head>
        <title>Stoa</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="h-full min-h-screen">
        <div className="bg-white">
          <div className="container mx-auto p-3">
            <div className="flex rounded-b-sm w-full items-center">
              <div className="shrink">
                <Link href={'/'}>
                  <div className="cursor-pointer">
                    <Logo imagePath={'/logo.svg'} size={64} />
                  </div>
                </Link>
              </div>
              <div className="flex-grow">
                <div className="flex justify-end items-center gap-5">
                  <NotificationBell notifications={[]} />
                  <AvatarMenu user={user} doLogout={doLogout} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-200 h-full min-h-screen p-5 md:p-0 md:pt-5 md:pb-5">
          <div className="container mx-auto">
            <div className="flex gap-3">
              <div className="hidden md:block md:w-1/4 flex justify-center">
                {user && <UserInfo user={user} />}
                {
                  !user && <div className="bg-white flex justify-center items-center p-5">
                    <Link href={'/login'}><a className="bg-blue-200 p-2 rounded-xl shadow-sm">Sign in</a></Link>
                  </div>
                }
              </div>
              <div className="w-full space-y-3 md:w-3/4 flex-col justify-center items-start">
                <Component {...pageProps} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MyApp
