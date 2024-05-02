// Resolvers define how to fetch the types defined in your schema.
import {Character, Guild, HouseInput} from "./generated/graphql";
import {House, Wizard} from "./data-source-types";

function parseWizard(wizard: Wizard):Character {
    return {
        name: wizard.firstName + " " + wizard.lastName
    }
}

function parseHouse(house: House):Guild {
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

function guildsResolver(parent: any, args: any, ctx: any, info: any): Guild[] {
    // Get data
    const houses: House[] = ctx.harryPotterDataSource.getHouses();
    console.log(houses);
    //Parse data to Guild
    const guilds: Guild[] = [];
    houses.forEach((house) => {
        guilds.push(parseHouse(house))
    });
    return guilds;
}

function guildByIdResolver(parent: any, args: any, ctx: any, info: any): Guild {
    const house: House | undefined = ctx.harryPotterDataSource.getHouseById(args.id);
    if(house) {
        return parseHouse(house);
    }else {
        return null;
    }
}

function parseHouseInput(houseInput: HouseInput): House {
    return {
        id: houseInput?.id,
        name: houseInput?.name,
        heads: [],
        traits: [],
        houseColours: houseInput?.colors,
        founder:  houseInput?.founder,
        animal: houseInput?.animal,
        ghost: houseInput?.ghost,
        element: houseInput?.element,
        commonRoom: houseInput?.commonRoom
    } as House;
}

function addGuildResolver(parent: any, args: any, ctx: any, info: any): Guild {
    //Convert HouseInput to House
    let house: House = parseHouseInput(args.house);
    //Add to datastore
    ctx.harryPotterDataSource.addHouse(house);
    //return Guild of House
    return parseHouse(house);
}

export const resolvers = {
    Query: {
        guilds: guildsResolver,
        guildById: guildByIdResolver
    },
    Mutation: {
      addGuild: addGuildResolver
    }
};