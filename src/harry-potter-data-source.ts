import axios from "axios";
import {House} from "./data-source-types";

export default class HarryPotterDataSource {
    async getHouses(): Promise<House[]> {
        try {
            const response =  await axios.get("https://wizard-world-api.herokuapp.com/Houses");
            return response.data;
        } catch (error) {
            console.log(error)
        }
    }

    async getHouseById(id: string): Promise<House[]> {
        try {
            const response =  await axios.get(`https://wizard-world-api.herokuapp.com/Houses/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
        }
    }
}