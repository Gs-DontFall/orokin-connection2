import * as moment from 'moment-timezone'
import { Guild, GuildMember } from 'discord.js'

export interface IBigBrowserV2Rang {
    name: string
    index: number
    start: number
    end?: number
}
export interface IBigBrowserV2Rangs {
    [xpStart: number]: IBigBrowserV2Rang
}

export interface IBigBrowserV2Server {
    id: string
    name: string
    createDate: number
    users: IBigBrowserV2Users
    tracking?: boolean
}
export interface IBigBrowserV2Servers {
    [id: string]: IBigBrowserV2Server
}
export interface IBigBrowserV2Users {
    [id: string]: IBigBrowserV2User
}

export interface IBigBrowserV2UserV1 {
    lastVocalDate: number
    totalVoiceTimeMs: number
    nbTextMessages: number
    nbTextMessagesWithDuplicates: number
    totalTextSize: number
    totalTextSizeWithDuplicates: number
    lastTextContent: string
    lastTextDate: number
    lastNotDuplicateTextDate: number
    wasVoicingLastTick: boolean
    totalWarframeDiscordTimeMs: number
    lastWarframeDiscordDate: number
    totalWarframeDiscordTimeMsUndefined: number
    lastWarframeDiscordDateUndefined: number

    oldServerId?: string
    oldUser?: string
}
export interface IBigBrowserV2User {
    
    displayName: string
    name: string
    isBot: boolean
    id: string
    createDate: number
    lastUpdate: number
    
    joinedTimestamp: number
    roles: string[]
    isWeird: boolean
    removedDate: number
    tracking?: boolean

    v1: IBigBrowserV2UserV1

    stats?: IBigBrowserV2UserStats

    dayStats?: IBigBrowserV2UserStatsTimed
    weekStats?: IBigBrowserV2UserStatsTimed
}
export interface IBigBrowserV2UserStatsTimed {
    date: number
    data: IBigBrowserV2UserStats
}
export interface IBigBrowserV2UserStats {
    lastVocalDate: number
    totalVoiceTimeMs: number
    nbTextMessages: number
    nbTextMessagesWithDuplicates: number
    totalTextSize: number
    totalTextSizeWithDuplicates: number
    lastTextContent: string
    lastTextDate: number
    lastNotDuplicateTextDate: number
    wasVoicingLastTick: boolean

    wasWarframeDiscordLastTickNot: boolean
    totalWarframeDiscordTimeMsNot: number
    lastWarframeDiscordDateNot: number
    wasWarframeDiscordLastTick: boolean
    wasWarframeDiscordLastTickUndefined: boolean

    totalWarframeDiscordTimeMsUndefined: number
    lastWarframeDiscordDateUndefined: number
    totalWarframeDiscordTimeMs: number
    lastWarframeDiscordDate: number
}

export class BigBrowserV2UserStats {
    public constructor(stats: IBigBrowserV2UserStats) {
        this._stats = stats;
    }

    public static create() {
        return new BigBrowserV2UserStats({
            lastVocalDate: undefined,
            totalVoiceTimeMs: 0,
            nbTextMessages: 0,
            nbTextMessagesWithDuplicates: 0,
            totalTextSize: 0,
            totalTextSizeWithDuplicates: 0,
            lastTextContent: undefined,
            lastTextDate: undefined,
            lastNotDuplicateTextDate: undefined,
            wasVoicingLastTick: false,
            lastWarframeDiscordDate: undefined,
            lastWarframeDiscordDateNot: undefined,
            lastWarframeDiscordDateUndefined: undefined,
            totalWarframeDiscordTimeMs: undefined,
            totalWarframeDiscordTimeMsNot: undefined,
            totalWarframeDiscordTimeMsUndefined: undefined,
            wasWarframeDiscordLastTick: undefined,
            wasWarframeDiscordLastTickNot: undefined,
            wasWarframeDiscordLastTickUndefined: undefined
        });
    }

    private _stats: IBigBrowserV2UserStats;
    public get stats() {
        return this._stats;
    }

    public get voiceXp() {
        return this.stats.totalVoiceTimeMs / (1000 * 60 * 30);
    }

    public get textXp() {
        return this.stats.totalTextSize / 500;
    }
    
    public get xp() {
        return this.voiceXp + this.textXp;
    }

    public clear() {
        for(const name in this.stats) {
            delete this.stats[name];
        }

        this.stats.lastVocalDate = undefined;
        this.stats.totalVoiceTimeMs = 0;
        this.stats.nbTextMessages = 0;
        this.stats.nbTextMessagesWithDuplicates = 0;
        this.stats.totalTextSize = 0;
        this.stats.totalTextSizeWithDuplicates = 0;
        this.stats.lastTextContent = undefined;
        this.stats.lastTextDate = undefined;
        this.stats.lastNotDuplicateTextDate = undefined;
        this.stats.wasVoicingLastTick = false;
    }
    
    public injectInto(stats: BigBrowserV2UserStats) {
        stats.stats.lastNotDuplicateTextDate = this.stats.lastNotDuplicateTextDate;
        stats.stats.lastTextContent = this.stats.lastTextContent;
        stats.stats.lastTextDate = this.stats.lastTextDate;
        stats.stats.lastVocalDate = this.stats.lastVocalDate;
        stats.stats.lastWarframeDiscordDate = this.stats.lastWarframeDiscordDate;
        stats.stats.lastWarframeDiscordDateNot = this.stats.lastWarframeDiscordDateNot;
        stats.stats.lastWarframeDiscordDateUndefined = this.stats.lastWarframeDiscordDateUndefined;
        stats.stats.nbTextMessages += this.stats.nbTextMessages;
        stats.stats.nbTextMessagesWithDuplicates += this.stats.nbTextMessagesWithDuplicates;
        stats.stats.totalTextSize += this.stats.totalTextSize;
        stats.stats.totalTextSizeWithDuplicates += this.stats.totalTextSizeWithDuplicates;
        stats.stats.totalVoiceTimeMs += this.stats.totalVoiceTimeMs;
        stats.stats.totalWarframeDiscordTimeMs += this.stats.totalWarframeDiscordTimeMs;
        stats.stats.totalWarframeDiscordTimeMsNot += this.stats.totalWarframeDiscordTimeMsNot;
        stats.stats.totalWarframeDiscordTimeMsUndefined += this.stats.totalWarframeDiscordTimeMsUndefined;
        stats.stats.wasVoicingLastTick = this.stats.wasVoicingLastTick;
        stats.stats.wasWarframeDiscordLastTick = this.stats.wasWarframeDiscordLastTick;
        stats.stats.wasWarframeDiscordLastTickNot = this.stats.wasWarframeDiscordLastTickNot;
        stats.stats.wasWarframeDiscordLastTickUndefined = this.stats.wasWarframeDiscordLastTickUndefined;
    }

    public merge(...stats: BigBrowserV2UserStats[]) {
        const result = this.clone();

        for(const item of stats) {
            item.injectInto(result);
        }

        return result;
    }

    public clone() {
        return new BigBrowserV2UserStats(JSON.parse(JSON.stringify(this.stats)));
    }
}
export class BigBrowserV2UserStatsTimed extends BigBrowserV2UserStats {
    public constructor(stats: IBigBrowserV2UserStatsTimed, timeDivider: (date: Date) => number) {
        super(stats.data);

        this._statsTimed = stats;
        this._timeDivider = timeDivider;
    }

    private _statsTimed: IBigBrowserV2UserStatsTimed;
    public get statsTimed() {
        return this._statsTimed;
    }

    public get date() {
        return this.statsTimed.date;
    }
    public set date(value) {
        this.statsTimed.date = value;
    }

    private _timeDivider: (date: Date) => number;
    public get timeDivider() {
        return this._timeDivider;
    }

    public getDateIndicator(date: number) {
        return this.timeDivider(new Date(date));
    }

    public get isObsolete() {
        return this.getDateIndicator(Date.now()) !== this.getDateIndicator(this.date);
    }
}

export class BigBrowserV2User {
    public constructor(userData: IBigBrowserV2User) {
        this._userData = userData;
    }

    private _userData: IBigBrowserV2User
    public get userData() {
        return this._userData;
    }

    public get stats() {
        return new BigBrowserV2UserStats(this.userData.stats);
    }
    public get dayStats() {
        return new BigBrowserV2UserStatsTimed(this.userData.dayStats, date => date.getDay());
    }
    public get weekStats() {
        return new BigBrowserV2UserStatsTimed(this.userData.weekStats, date => {
            const onejan = new Date(date.getFullYear(), 0, 1);
            const millisecsInDay = 86400000;
            return Math.ceil((((date.getTime() - onejan.getTime()) / millisecsInDay) + onejan.getDay() + 1) / 7);
        });
    }
}

export class BigBrowserV2 {
    constructor() {
        let index = -1;
        let lastRank = undefined;
        for(const rankStart in this.ranks)
        {
            const rank = this.ranks[rankStart];
            rank.start = rankStart as any as number;
            rank.index = ++index;
    
            if(lastRank)
                lastRank.end = rank.start;
    
            lastRank = rank;
        }
    }

    public getRosterRanks(guild: Guild, nbRoster = 10) {
        const users = this.getFilteredUsers(guild)
            .filter(user => !user.userData.isBot);

        const extract = (statsMapper: (user: BigBrowserV2User) => BigBrowserV2UserStats) => users
            .map(user => ({
                user: user,
                stats: statsMapper(user)
            }))
            .sort((a, b) => b.stats.stats.lastVocalDate - a.stats.stats.lastVocalDate)
            .sort((a, b) => b.stats.voiceXp - a.stats.voiceXp)
            .slice(0, nbRoster);
        
        return {
            day: extract(user => user.dayStats),
            week: extract(user => user.weekStats.merge(user.dayStats)),
            global: extract(user => user.stats)
        }
    }

    ranks: IBigBrowserV2Rangs = {
        0: {
            name: 'Chair à canon'
        },
        50: {
            name: 'Galinette cendrée'
        },
        100: {
            name: 'Rejeté'
        },
        150: {
            name: 'Bouclier humain'
        },
        200: {
            name: 'Noob'
        },
        250: {
            name: 'Mauvaise herbe'
        },
        300: {
            name: 'Jeune pousse écrasée'
        },
        350: {
            name: 'Poussin KFC'
        },
        400: {
            name: 'Pion du neant'
        },
        450: {
            name: 'Vagabon'
        },
        500: {
            name: 'Tenno'
        },
        550: {
            name: 'Portier de Lua'
        },
        600: {
            name: 'Apprenti samurai'
        },
        650: {
            name: 'Samurai'
        },
        700: {
            name: 'Rōnin'
        },
        750: {
            name: 'Acharné'
        },
        800: {
            name: 'Fanatique'
        },
        850: {
            name: 'Dur à cuire'
        },
        900: {
            name: 'Orokin apprenti'
        },
        950: {
            name: 'Orokin'
        },
        1000: {
            name: 'Orokin officier'
        },
        1050: {
            name: 'Orokin general'
        },
        1100: {
            name: 'Orokin etat major'
        },
        1150: {
            name: 'Orokin marechal'
        },
        1200: {
            name: 'Vaulted'
        }
    } as any;

    protected servers: IBigBrowserV2Servers;
    
    private _xpMultiplier: number = 1;
    public get xpMultiplier() {
        return this._xpMultiplier;
    }
    public set xpMultiplier(value) {
        this._xpMultiplier = value ?? 1;
    }

    getServers()
    {
        if(!this.servers)
            this.servers = {};
        
        return this.servers;
    }

    getServer(guild: { id: string, name: string })
    {
        const servers = this.getServers();
        const now = Date.now();

        const serverId = guild.id;

        let server = servers[serverId];
        if(!server)
        {
            server = {
                id: serverId,
                name: guild.name,
                createDate: now,
                users: {}
            };

            servers[serverId] = server;
        }
        
        return server;
    }

    getUserVoiceExp(user: IBigBrowserV2User)
    {
        const score30minutes = user.stats.totalVoiceTimeMs / (1000 * 60 * 30);
        return score30minutes;
    }

    getUserTextExp(user: IBigBrowserV2User)
    {
        const score500chars = user.stats.totalTextSize / 500;
        return score500chars;
    }

    getUserExp(user: IBigBrowserV2User)
    {
        const voiceScore = this.getUserVoiceExp(user);
        const textScore = this.getUserTextExp(user);

        return voiceScore + textScore;
    }

    getUserRanking(user: IBigBrowserV2User, server: Guild | IBigBrowserV2Server)
    {
        const users = this.getSortedUsers(server).reverse();
        const len = users.length;

        let index;
        for(index = 0; index < len; ++index)
        {
            if(users[index].id == user.id)
                break;
        }
        
        return {
            index: index,
            total: len
        }
    }

    getUserRank(user: IBigBrowserV2User, exp: number)
    {
        if(exp === undefined)
            exp = this.getUserExp(user);

        const ranks = this.ranks;

        let lastMatchingRank = ranks[0];
        let nextRank = undefined;
        for(const rankStart in ranks)
        {
            const rank = ranks[rankStart];

            if(exp >= rank.start)
            {
                lastMatchingRank = rank;
            }
            else if(!nextRank)
            {
                nextRank = rank;
                break;
            }
        }

        if(nextRank === lastMatchingRank)
            nextRank = undefined;

        const expFromCurrentToNextRank = nextRank ? nextRank.start - lastMatchingRank.start : 0;
        const expLeftToNextRank = nextRank ? nextRank.start - exp : 0;
        const expLeftToNextRankPercent = nextRank ? expLeftToNextRank / expFromCurrentToNextRank : 1;

        return {
            exp: exp,
            currentRank: lastMatchingRank,
            nextRank: nextRank,
            expInCurrentRank: exp - lastMatchingRank.start,
            expFromCurrentToNextRank: expFromCurrentToNextRank,
            expLeftToNextRank: expLeftToNextRank,
            expLeftToNextRankPercent: expLeftToNextRankPercent,
            currentExpPercentToNextRank: 1 - expLeftToNextRankPercent
        };
    }

    deleteUser(member)
    {
        const id = member.id;
        const server = this.getServer(member.guild);

        if(!server.users)
            server.users = {};

        delete server.users[id];
    }

    deleteServer(guild: Guild)
    {
        const servers = this.getServers();

        delete servers[guild.id];
    }

    getUser(member: GuildMember)
    {
        const now = Date.now();

        const id = member.id;
        const server = this.getServer(member.guild);

        if(!server.users)
            server.users = {};

        let user = server.users[id];
        if(!user)
        {
            user = {
                id: id,
                createDate: now
            } as any;
            server.users[id] = user;
        }
        
        user.lastUpdate = now;
        user.displayName = member.displayName;
        user.name = member.nickname;

        if((member as any).bot !== undefined)
            user.isBot = (member as any).bot;
        if(member.user && member.user.bot !== undefined)
            user.isBot = member.user.bot;
        
        if(!user.stats)
        {
            user.stats = BigBrowserV2UserStats.create().stats;
        }

        if(!user.dayStats) {
            user.dayStats = {
                date: 0,
                data: BigBrowserV2UserStats.create().stats
            }
        }
        if(!user.weekStats) {
            user.weekStats = {
                date: 0,
                data: BigBrowserV2UserStats.create().stats
            }
        }

        if(!user.joinedTimestamp)
            user.joinedTimestamp = member.joinedTimestamp;

        if(member.roles)
            user.roles = member.roles.array().map((role) => role.name);

        if(member.roles)
            user.isWeird = member.roles.array().some((role) => role.name === 'EN phase de test' || role.name === 'Tenno') && !user.stats.totalVoiceTimeMs;

        const zero = (name) => {
            if(user.stats[name] === undefined)
                user.stats[name] = 0;
        }
        
        zero('totalWarframeDiscordTimeMs');
        zero('totalWarframeDiscordTimeMsNot');
        zero('totalWarframeDiscordTimeMsUndefined');

        return user;
    }

    save()
    {
        return {
            servers: this.getServers(),
            xpMultiplier: this.xpMultiplier
        };
    }
    load(obj: any, ctx) {
        this.servers = obj.servers;
        this.xpMultiplier = obj.xpMultiplier;
    }

    initWithV1Data(servers: any)
    {
        var now = Date.now();

        for(const serverId in servers)
        {
            const oldServer = servers[serverId];
            const server = this.getServer({
                id: oldServer.__id__ || serverId,
                name: oldServer.__name__
            });

            if(!server.users)
                server.users = {};

            for(const userId in oldServer)
            {
                if(userId !== '__name__' && userId !== '__id__')
                {
                    const oldUser = oldServer[userId];

                    const user: IBigBrowserV2User = {
                        displayName: oldUser.__name__,
                        isBot: false,
                        id: userId,
                        createDate: now,
                        lastUpdate: now,
                        v1: {
                            lastVocalDate: oldUser.vocalActivity_date,
                            totalVoiceTimeMs: (oldUser.vocalActivity * 500) / (1 / (30 * 60 * 2)),
                            nbTextMessages: oldUser.textActivity * 2,
                            nbTextMessagesWithDuplicates: oldUser.textActivity * 2,
                            totalTextSize: oldUser.textActivity * 2 * 18,
                            totalTextSizeWithDuplicates: oldUser.textActivity * 2 * 18,
                            lastTextContent: undefined,
                            lastTextDate: oldUser.textActivity_date,
                            lastNotDuplicateTextDate: oldUser.textActivity_date,
                            wasVoicingLastTick: false,
                            totalWarframeDiscordTimeMs: oldUser.warframeActivity ? oldUser.warframeActivity * 500 : undefined,
                            lastWarframeDiscordDate: oldUser.warframeActivity_date ? oldUser.warframeActivity_date : undefined,
                            totalWarframeDiscordTimeMsUndefined: oldUser.warframeActivity_total ? oldUser.warframeActivity_total * 500 : undefined,
                            lastWarframeDiscordDateUndefined: oldUser.warframeActivity_date ? oldUser.warframeActivity_date : undefined
                        }
                    } as any;

                    user.stats = JSON.parse(JSON.stringify(user.v1));
                    user.v1.oldServerId = serverId;
                    user.v1.oldUser = oldUser;

                    server.users[userId] = user;
                }
            }
        }
    }

    updateServer(guild: Guild)
    {
        const now = Date.now();

        const server = this.getServer(guild);

        let nbUsers = Object.keys(server.users).length + 1;
        const onDone = () => {
            --nbUsers;

            if(nbUsers === 0)
            {
                this.save();
            }
        }

        for(const userId in server.users)
        {
            const user = server.users[userId];

            if(!user.removedDate) {
                guild.fetchMember(userId).then(() => {
                    onDone();
                }).catch(() => {
                    user.removedDate = Date.now();

                    onDone();
                })
            } else {
                onDone();
            }
        }

        guild.members.array().forEach((member) => {

            /*
            if(member.displayName !== 'Akamelia ♡')
                return;*/
            const userData = this.getUser(member);
            const user = new BigBrowserV2User(userData);

            let isInWarframe = undefined;
            if(member.user.presence && member.user.presence.game && member.user.presence.game.name)
                isInWarframe = member.user.presence.game.name.toLowerCase() === 'warframe';

            const updateStats = (stats: IBigBrowserV2UserStats) => {
                if(isInWarframe !== undefined)
                {
                    if(isInWarframe)
                    {
                        if(!stats.wasWarframeDiscordLastTick)
                        {
                            stats.wasWarframeDiscordLastTick = true;
                        }
                        else
                        {
                            stats.totalWarframeDiscordTimeMs += now - stats.lastWarframeDiscordDate;
                        }
                        
                        stats.lastWarframeDiscordDate = now;
                        stats.wasWarframeDiscordLastTickNot = false;
                    }
                    else
                    {
                        if(!stats.wasWarframeDiscordLastTickNot)
                        {
                            stats.wasWarframeDiscordLastTickNot = true;
                        }
                        else
                        {
                            stats.totalWarframeDiscordTimeMsNot += now - stats.lastWarframeDiscordDateNot;
                        }
                        
                        stats.lastWarframeDiscordDateNot = now;
                        stats.wasWarframeDiscordLastTick = false;
                    }
                    
                    stats.wasWarframeDiscordLastTickUndefined = false;
                }
                else
                {
                    if(!stats.wasWarframeDiscordLastTickUndefined)
                    {
                        stats.wasWarframeDiscordLastTickUndefined = true;
                    }
                    else
                    {
                        stats.totalWarframeDiscordTimeMsUndefined += now - stats.lastWarframeDiscordDateUndefined;
                    }
                    
                    stats.lastWarframeDiscordDateUndefined = now;
                    stats.wasWarframeDiscordLastTickNot = false;
                    stats.wasWarframeDiscordLastTick = false;
                }
                
                if(member.voiceChannelID && !member.deaf && member.voiceChannelID !== guild.afkChannelID)
                {
                    if(!stats.wasVoicingLastTick)
                    {
                        stats.wasVoicingLastTick = true;
                    }
                    else
                    {
                        stats.totalVoiceTimeMs += now - stats.lastVocalDate;
                    }
                    
                    stats.lastVocalDate = now;
                }
                else
                {
                    stats.wasVoicingLastTick = false;
                }
            }

            if(user.dayStats.isObsolete) {
                user.dayStats.injectInto(user.weekStats);
                user.dayStats.date = now;
                user.dayStats.clear();
            }
            if(user.weekStats.isObsolete) {
                user.weekStats.date = now;
                user.weekStats.clear();
            }

            updateStats(userData.stats);
            updateStats(userData.dayStats.data);
        })

        onDone();
    }

    updateUserText(message)
    {
        const content = message.content;

        if(content)
        {
            const member = message.member;

            /*
            if(member.displayName !== 'Akamelia ♡')
                return;*/
            const user = this.getUser(member);
            const now = Date.now();

            if(user.stats.lastTextContent !== content)
            {
                ++user.stats.nbTextMessages;
                user.stats.totalTextSize += message.content.length;
                user.stats.lastNotDuplicateTextDate = now;
            }

            user.stats.lastTextContent = content;
            ++user.stats.nbTextMessagesWithDuplicates;
            user.stats.totalTextSizeWithDuplicates += message.content.length;
            user.stats.lastTextDate = now;
        }
    }

    setTrackingUser(member, isTracking)
    {
        const user = this.getUser(member);

        if(isTracking)
        {
            if(user && user.tracking === false)
                this.deleteUser(member);
        }
        else
        {
            if(user)
            {
                for(const propName in user)
                    delete user[propName];
                
                user.tracking = false;
            }
        }
    }

    setTrackingServer(guild: Guild, isTracking)
    {
        const server = this.getServer(guild);

        if(isTracking)
        {
            if(server && server.tracking === false)
                this.deleteServer(guild);
        }
        else
        {
            if(server)
            {
                for(const propName in server)
                    delete server[propName];
                
                server.tracking = false;
            }
        }
    }

    getServersText(servers, withBOM) {
        let result = '';
        let isFirst = true;

        for(let server of servers)
        {
            if(!isFirst)
                result += '\r\n';

            isFirst = false;

            if(server.constructor && server.constructor.name === 'Guild')
                server = this.getServer(server);

            if(server.tracking !== false)
            {
                const body = this.getServerText(server);
                const firstLine = body.split(/\r?\n/img, 2)[1];

                let header = '';
                let nbCharsLeft = firstLine.length - (server.name.length + 4) * 3 - 4 * 2;
                for(let i = 0; i < 4; ++i)
                    header += '=';
                header += `[ ${server.name} ]`;
                for(let i = 0; i < nbCharsLeft / 2; ++i)
                    header += '=';
                header += `[ ${server.name} ]`;
                for(let i = 0; i < nbCharsLeft / 2; ++i)
                    header += '=';
                header += `[ ${server.name} ]`;
                for(let i = 0; i < 4; ++i)
                    header += '=';

                let footer = '';
                while(footer.length < firstLine.length)
                    footer += '=';

                result += `${header}\r\n`;
                result += body;
                result += `\r\n${footer}\r\n`;
            }
        }

        return result;
    }

    getServersCSV(servers, withBOM) {
        let result = withBOM ? decodeURIComponent('%EF%BB%BF') : '';
        let isFirst = true;

        for(let server of servers)
        {
            if(!isFirst)
                result += '\r\n\r\n';

            isFirst = false;

            if(server.constructor && server.constructor.name === 'Guild')
                server = this.getServer(server);

            if(server.tracking !== false)
            {
                result += `================================;${server.name}\r\n`;
                result += this.getServerCSV(server, false);
            }
        }

        return result;
    }

    getServersMarkDown(servers) {
        let result = '';
        let isFirst = true;

        for(let server of servers)
        {
            if(!isFirst)
                result += '\r\n\r\n';

            isFirst = false;

            if(server.constructor && server.constructor.name === 'Guild')
                server = this.getServer(server);

            if(server.tracking !== false)
            {
                result += `**${server.name}**\r\n`;
                result += this.getServerMarkDown(server);
            }
        }

        return result;
    }

    getServerCSV(server, withBOM) {
        
        const formatter = {
            row: function(...argss: any[]) {
                const args = [];
        
                for(const arg of argss)
                {
                    if(arg === undefined || arg === null)
                        args.push('?');
                    else
                        args.push(arg.toString());
                }
                
                return `${args.join(';')}\r\n`;
            },
            noRow: undefined as ((...args: any[]) => string)
        };

        formatter.noRow = formatter.row;

        const text = this.getServerFormatted(server, formatter);

        return (withBOM ? decodeURIComponent('%EF%BB%BF') : '') + text;
    }

    getServerMarkDown(server) {

        let nbCols = undefined;

        const formatter = {
            headerEnd: function() {
                let text = '';

                for(let i = 0; i < nbCols; ++i)
                    text += '|-';

                return `${text}|\r\n`;
            },
            row: function(...argss: any[]) {
                if(nbCols === undefined)
                    nbCols = argss.length;
                
                const args = [];

                for(const arg of argss)
                {
                    if(arg === undefined || arg === null)
                        args.push('?');
                    else
                        args.push(arg.toString());
                }
                
                return `| ${args.join(' | ')} |\r\n`;
            },
            noRow: function(...argss: any[]) {
                const args = [];
        
                for(const arg of argss)
                {
                    if(arg === undefined || arg === null)
                        args.push('?');
                    else
                        args.push(arg.toString());
                }
                
                return `| ${args.join(' ')} |\r\n`;
            }
        };

        return this.getServerFormatted(server, formatter);
    }

    getServerText(server) {

        const pad = (value, nb: number = 0, char?: string) => {
            value = value === undefined || value === null ? '' : value.toString();
            
            if(char === undefined)
                char = ' ';

            while(value.length < nb)
                value = `${char}${value}`;

            return value;
        };

        let pads = [
            35, 35,  0,  0, 20,
            20,  0,  0,  0,  0,
            0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,
        ];

        let isFirstRow = true;
        
        const formatter = {
            headerEnd: function() {
                let str = '';

                for(const padding of pads)
                {
                    if(padding)
                    {
                        str += pad('', padding + 3, '=');
                    }
                }
                
                return str.substring(0, str.length - 3) + '\r\n';
            },
            row: function(...argss: any[]) {
                const args = [];
                let index = 0;
        
                for(const arg of argss)
                {
                    if(arg === undefined || arg === null)
                        args.push(pad('?', pads[index]));
                    else
                        args.push(pad(arg.toString(), pads[index]));

                    ++index;
                }

                if(isFirstRow)
                {
                    isFirstRow = false;

                    pads = args.map((str, i) => {
                        const pad = pads[i];
                        if(!pad)
                            return str.length;
                        else
                            return pad;
                    })
                }
                
                return `${args.join(' | ')}\r\n`;
            },
            noRow: function(...argss: any[]) {
                const args = [];
        
                for(const arg of argss)
                {
                    if(arg === undefined || arg === null)
                        args.push('?');
                    else
                        args.push(arg.toString());
                }
                
                return `${args.join(' ')}\r\n`;
            }
        };

        return this.getServerFormatted(server, formatter);
    }

    public getFilteredUsers(_server: Guild | IBigBrowserV2Server) {
        if(_server.constructor && _server.constructor.name === 'Guild')
            _server = this.getServer(_server);

        const server = _server as IBigBrowserV2Server;

        const users = Object.keys(server.users)
            .map(id => server.users[id])
            .filter(user => !user.removedDate)
            .filter(user => user.tracking !== false)
            .map(user => new BigBrowserV2User(user));

        return users;
    }

    getSortedUsers(_server: Guild | IBigBrowserV2Server) {
        if(_server.constructor && _server.constructor.name === 'Guild')
            _server = this.getServer(_server);

        const server = _server as IBigBrowserV2Server;

        const users = Object.keys(server.users)
            .map(id => server.users[id])
            .filter(user => !user.removedDate)
            .filter(user => user.tracking !== false)
            .sort((u1, u2) => {
                const u1exp = this.getUserExp(u1);
                const u2exp = this.getUserExp(u2);
                
                return u1exp > u2exp ? 1 : u1exp === u2exp ? 0 : -1;
            });

        return users;
    }

    getServerFormatted(server: Guild | IBigBrowserV2Server, formatter) {
        let text = '';
        
        formatter.asDate = formatter.asDate || ((date, includeTime) => {
            let dateString;
            let dateObj = moment(date).tz('Europe/Paris');

            if(includeTime === false)
                dateString = dateObj.format('DD/MM/YYYY');
            else
                dateString = dateObj.format('DD/MM/YYYY HH:mm');

            return dateString;
        });

        formatter.asPercent = formatter.asPercent || ((value) => {
            value = value || 0;
            return (value * 100).toString();
        });
        
        formatter.asInteger = formatter.asInteger || ((value) => {
            value = value || 0;
            value = Math.floor(value);
            return value.toString();
        });

        formatter.asFloat = formatter.asFloat || ((value) => {
            value = value || 0;
            return value.toString();
        });

        formatter.asBool = formatter.asBool || ((value) => {
            return value ? '1' : '0';
        });

        formatter.asString = formatter.asString || ((value) => {
            return value !== undefined && value !== null ? value.toString() : ''
        });

        const users = this.getSortedUsers(server);

        if(formatter.onStart)
            formatter.onStart(users);

        if(users.length === 0)
        {
            text = formatter.noRow();
        }
        else
        {
            if(formatter.headerStart)
                text += formatter.headerStart();

            text += formatter.row(
                formatter.asString('Utilisateur (nom affiché)'),
                formatter.asString('Utilisateur (compte)'),
                formatter.asString('Est un bot ?'),

                formatter.asString('Expérience totale (exp)'),
                formatter.asString('Rang'),
                formatter.asString('Prochain rang'),
                formatter.asString('Progression vers le prochain rang (%)'),
                formatter.asString('Expérience restante avant prochain rang (exp)'),
                formatter.asString('Expérience restante avant prochain rang (%)'),

                formatter.asString('Expérience vocale (exp)'),
                formatter.asString('Temps total en vocal (ms)'),
                formatter.asString('Dernière mise à jour exp vocale'),

                formatter.asString('Expérience écrite (exp)'),
                formatter.asString('Dernière mise à jour exp écrite'),

                formatter.asString('Nb messages textes'),
                formatter.asString('Taille totale des messages textes'),
                formatter.asString('Nb messages textes (avec duplicatas)'),
                formatter.asString('Taille totale des messages textes (avec duplicatas)'),
                
                formatter.asString('Temps total sur Warframe (%)'),

                formatter.asString('Temps total sur Warframe (ms)'),
                formatter.asString('Dernière connection à Warframe'),

                formatter.asString('Temps total sur autre chose que Warframe (ms)'),
                formatter.asString('Dernier jeu autre que Warframe'),

                formatter.asString('Temps total sur aucune application (ms)'),
                formatter.asString('Dernière connection à aucune application'),

                formatter.asString('Date de join'),
                formatter.asString('Roles'),

                formatter.asString('Inactif ?')
            );

            if(formatter.headerEnd)
                text += formatter.headerEnd();
            
            if(formatter.bodyStart)
                text += formatter.bodyStart();

            for(const user of users)
            {
                const exp = this.getUserExp(user);
                const rank = this.getUserRank(user, exp);

                text += formatter.row(
                    formatter.asString(user.displayName),
                    formatter.asString(user.name),
                    formatter.asBool(user.isBot),

                    formatter.asFloat(exp),
                    formatter.asString(rank.currentRank ? rank.currentRank.name : undefined),
                    formatter.asString(rank.nextRank ? rank.nextRank.name : undefined),
                    formatter.asPercent(rank.currentExpPercentToNextRank),
                    formatter.asFloat(rank.expLeftToNextRank),
                    formatter.asPercent(rank.expLeftToNextRankPercent),

                    formatter.asFloat(this.getUserVoiceExp(user)),
                    formatter.asInteger(user.stats.totalVoiceTimeMs),
                    formatter.asDate(user.stats.lastVocalDate),

                    formatter.asFloat(this.getUserTextExp(user)),
                    formatter.asDate(user.stats.lastTextDate),

                    formatter.asInteger(user.stats.nbTextMessages),
                    formatter.asInteger(user.stats.totalTextSize),
                    formatter.asInteger(user.stats.nbTextMessagesWithDuplicates),
                    formatter.asInteger(user.stats.totalTextSizeWithDuplicates),

                    !user.stats.lastWarframeDiscordDate && !user.stats.lastWarframeDiscordDateNot
                        ? formatter.asString('N/A')
                        : formatter.asPercent(user.stats.totalWarframeDiscordTimeMs / (user.stats.totalWarframeDiscordTimeMs + user.stats.totalWarframeDiscordTimeMsNot + user.stats.totalWarframeDiscordTimeMsUndefined)),

                    formatter.asInteger(user.stats.totalWarframeDiscordTimeMs),
                    formatter.asDate(user.stats.lastWarframeDiscordDate),

                    formatter.asInteger(user.stats.totalWarframeDiscordTimeMsNot),
                    formatter.asDate(user.stats.lastWarframeDiscordDateNot),

                    formatter.asInteger(user.stats.totalWarframeDiscordTimeMsUndefined),
                    formatter.asDate(user.stats.lastWarframeDiscordDateUndefined),

                    formatter.asDate(user.joinedTimestamp),
                    formatter.asString((user.roles || []).join(' / ')),

                    formatter.asBool(user.isWeird || false)
                );
            }

            if(formatter.bodyEnd)
                text += formatter.bodyEnd();
        }

        return (text as any).trimRight();
    }
}
