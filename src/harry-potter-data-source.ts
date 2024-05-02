import axios from "axios";
import {House} from "./data-source-types";

export default class HarryPotterDataSource {
    data:House[] = [];
    private static instance;

    static async create() {
        if(this.instance == null) {
            const data = await this.getHousesData();
            console.log("Loading data: " + data);
            this.instance = new HarryPotterDataSource(data)
        }
        return this.instance;
    }

    static async getHousesData(): Promise<House[]> {
        try {
            const response =  await axios.get("https://wizard-world-api.herokuapp.com/Houses");
            return response.data;
        } catch (error) {
            console.log(error)
        }
    }

    constructor(data) {
        this.data = data;
    }

    getHouses(): House[] {
        return this.data;
    }

    getHouseById(id: string): House | undefined {
        let houseToReturn = undefined;
        this.data.forEach((house) => {
            if(house.id == id) {
                houseToReturn = house;
            }
        })
        return houseToReturn;
    }

    addHouse(house:House) {
        this.data.push(house);
    }
}