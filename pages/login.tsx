import { NextPage } from "next";
import { FormEvent, useEffect, useState } from "react";
import { useUser } from "../services/useUser";
import Router from 'next/router'
import { login } from "../services/api";
import { config } from '../appconfig';
import { translate } from '../services/translate';

const LoginPage: NextPage = () => {
    const [name, setName] = useState('');

    const { user, mutateUser } = useUser()

    useEffect(() => {
        if (user && user.id) {
            Router.push('/');
        }
    }, [user])


    const signin = async (ev: FormEvent<any>) => {
        ev.preventDefault();

        try {
            mutateUser(
                await login(name)
            )
        } catch (error) {
            console.error('An unexpected error happened:', error)
        }
    }

    return (<>
        <div className="bg-white flex flex-col gap-5 rounded-sm shadow-sm h-96 items-center justify-center">
            <form className="flex flex-col gap-8 justify-center w-1/4" onSubmit={async (ev) => { await signin(ev); }}>
                <div className="flex flex-col gap-3">
                    <label htmlFor="name" className="text-gray-400">{translate('FORM_NAME', config.language)}</label>
                    <input id="name" required className="border border-gray-300 rounded-sm shadow-sm p-3" placeholder={translate('FORM_NAME_PALACEHOLDER', config.language)} type="text" onChange={(ev) => { setName(ev.target.value) }} />
                </div>
                <div>
                    <input className="w-full text-white p-3 shadow-xl rounded-xl bg-gradient-to-r from-blue-400 to-blue-500 w-1/2 text-center" type="submit" />
                </div>
            </form>
        </div>
    </>)
}

export default LoginPage;