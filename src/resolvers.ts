// Resolvers define how to fetch the types defined in your schema.
import {Character, Guild} from "./generated/graphql";
import {House, Wizard} from "./data-source-types";

function parseWizard(wizard: Wizard):Character {
    return {
        name: wizard.firstName + " " + wizard.lastName
    }
}

function parseHouse(house):Guild {
    const characters: Character[] = [];
    house.heads.forEach((head) => {characters.push(parseWizard(head))});
    const traits: string[] = [];
    house.traits.forEach((trait) => {traits.push(trait.name)});
    return {
        symbol: house.element + " " + house.animal,
        heads: characters,
        id: house.id,
        name: house.name,
        room: house.commonRoom,
        colors: house.houseColours,
        traits: traits.join(", "),
        ghost: house.ghost,
        founder: {
            name: house.founder
        }
    };
}

async function guildsResolver(parent: any, args: any, ctx: any, info: any): Promise<Guild[]> {
    // Get data
    const houses: House[] = await ctx.harryPotterDataSource.getHouses();
    console.log(houses);
    //Parse data to Guild
    const guilds: Guild[] = [];
    houses.forEach((house) => {
        guilds.push(parseHouse(house))
    });
    return guilds;
}

async function guildByIdResolver(parent: any, args: any, ctx: any, info: any): Promise<Guild> {
    const house: House = await ctx.harryPotterDataSource.getHouseById(args.id);
    return parseHouse(house);
}

export const resolvers = {
    Query: {
        guilds: guildsResolver,
        guildById: guildByIdResolver
    }
};