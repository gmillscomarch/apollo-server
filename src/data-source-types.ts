export type Wizard = {
    id: string
    firstName: string
    lastName: string
}

export type Trait = {
    id: string
    name: string
}

export type House = {
    id: string
    name: string
    houseColours: string
    founder: string
    animal: string
    element: string
    ghost: string
    commonRoom: string
    heads: Wizard[]
    traits: Trait[]
}
