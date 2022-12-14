import { withIronSessionSsr } from "iron-session/next";
import { NextPage } from "next";
import { IdeaCard } from "../../components/ideacard";
import { sessionOptions } from "../../services/session";
import { useRouter } from 'next/router'
import { fetchByIdData } from "../../entity/topic";
import { getRedisClient } from "../../services/redis";
import { viewSchema } from "../../entity/view";
import { config } from '../../appconfig';
import { translate } from '../../services/translate';
import { useUser } from "../../services/useUser";

const TopicPage: NextPage = ({ topic, user }: any) => {
    // const { user } = useUser();
    return (
        <>
            <IdeaCard t={topic} u={user} nolikeText={translate('NOLIKE', config.language)} likedText={translate('LIKED', config.language)} likeText={translate('LIKE', config.language)} commentText={translate('COMMENT', config.language)} viewText={translate('VIEW', config.language)} commentPlaceholder={translate('COMMENT_PLACEHOLDER', config.language)} doCommentText={translate('DO_COMMENT', config.language)} signInCommentText={translate('SIGN_IN_COMMENT', config.language)} signInToLikeText={translate('SIGN_IN_LIKE', config.language)} noCommentYetText={translate('NO_COMMENTS_YET', config.language)} />
        </>
    )
}

export const getServerSideProps = withIronSessionSsr(async function ({
    req,
    res,
}) {
    let splited = req?.url?.split('/');
    let id = null;
    if (splited != undefined) {
        id = splited[2];
    }
    let data = await fetchByIdData(id as string, req.session.user);

    let user = null;
    if (req.session.user) {
        user = req.session.user;
    }

    // add view log, @TODO move to service
    if (user) {
        let client = await getRedisClient();
        let viewRepo = client.fetchRepository(viewSchema);
        viewRepo.createAndSave(
            {
                object: 'topic',
                objectid: data.id,
                author: user.entityId,
                created: new Date(),
            }
        );
        // refresh after new view
        data = await fetchByIdData(id as string, req.session.user);
    }

    return {
        props: {
            user: user,
            topic: data,
        }, // will be passed to the page component as props
    }
},
    sessionOptions)

export default TopicPage;