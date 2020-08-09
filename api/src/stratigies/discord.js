const passport = require('passport');
const DiscordStrategy = require('passport-discord');
const User = require('../database/schemas/user');

passport.serializeUser((user, done) => {
    done(null, user.discordId)
});

passport.deserializeUser(async (discordId, done) => {
    try {
        const user = await User.findOne({ discordId });
        return user ? done(null, user) : done(null, null);
    } catch (err) {
        console.log(err);
        done(err, null);
    }
});

passport.use(new DiscordStrategy({
    clientID: '633327042590539776',
    clientSecret: 'g5RcxfNYb4kWiyvJTQD0YMRXG_lQi33w' ,
    callbackURL: '/auth/discord/redirect' ,
    scope: ['guilds', 'identify'],
}, async (accessToken, refreshToken, profile, done) => {
        const { id, username, discriminator, avatar, guilds} = profile;
        console.log(id, username, discriminator, avatar, guilds);

        try {
            const findUser = await User.findOneAndUpdate({ discordId: id }, {
                discordTag: `${username}#${discriminator}`,
                avatar,
                guilds,
            }, { new: true});
            if (findUser) {
                console.log('user was found');
                return done(null, findUser)
            } else {
                const newUser = await User.create({
                    discordId: id,
                    discordTag: `${username}#${discriminator}`,
                    avatar,
                    guilds,
                });
                return done(null, newUser);
            }
        } catch (err) {
            console.log(err)
        }
    })
);



// Clinet secret B70viQgsjHZprUeMDYv-ifEy23BCzny_

// Redirect /auth/discord/redirect