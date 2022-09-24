import BaseModel from "./BaseModel";


class CardsModel extends BaseModel {
    constructor() {
        super();
        this.url = 'https://randomuser.me/api/?seed=foobar&results=100&inc=gender,name,email,dob,phone,picture,location';
        this.attributes = null;
        this.users = null;
        this.error = null;
        if (!CardsModel.instance) {
            CardsModel.instance = this;
        }

        return CardsModel.instance;
    }


    createUserList() {

        fetch(this.url)
            .then((response, reject) => this.clear(response, reject))
            .then(response => response.json())
            .then(results => results.results)
            .then(users => this.setAtribute(users))
            .catch(err => {
                this.error = err.message;
                console.error(err);
                this.publish('changeData');
            });

    }

    setAtribute(users) {

        this.users = users.map((user) => {
            return {
                image: user.picture.large,
                name: (user.name.first + ' ' + user.name.last),
                gender: user.gender,
                age: user.dob.age,
                phone: user.phone,
                email: user.email,
                location: user.location.city,
            };
        });
        this.error = null;
        this.findAndSort({ gender: "both", sort: "abcAscending" })

    }

    findAndSort({ name, minAge, maxAge, gender, sort }) {

        if (!this.users) {
            this.createUserList()

        }
        this.attributes = this.users;
        if (name) {
            this.filterByName(name)
        };
        if (minAge || maxAge) {
            this.filterByAge(minAge, maxAge)
        };
        if (gender) {
            this.filterByGender(gender)
        };
        if (sort) {
            this.sort(sort)
        };
        this.publish('changeData');
    }

    filterByName(name) {
        this.attributes = this.attributes.filter((user) => (user.name.toLowerCase().includes(name.toLowerCase())));
    }

    filterByAge(minAge = 0, maxAge = 999) {
        if (minAge > maxAge) {
            let i = minAge;
            minAge = maxAge;
            maxAge = i;
        }
        this.attributes = this.attributes.filter((user) => (user.age >= minAge && user.age <= maxAge));
    }

    filterByGender(gender) {
        if (gender != 'both') {
            this.attributes = this.attributes.filter((user) => (user.gender === gender));
        }
    }

    sort(sort) {
        switch (sort) {
            case "abcAscending":
                this.attributes = this.attributes.sort(function (a, b) {
                    var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
                    if (nameA < nameB)
                        return -1
                    if (nameA > nameB)
                        return 1
                    return 0
                });
                break;

            case "abcDescending":
                this.attributes = this.attributes.sort(function (a, b) {
                    var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
                    if (nameA > nameB)
                        return -1
                    if (nameA < nameB)
                        return 1
                    return 0
                })
                break;
            case "ageAscending":
                this.attributes = this.attributes.sort(function (a, b) {
                    return a.age - b.age;
                });
                break;
            case "ageDescending":
                this.attributes = this.attributes.sort(function (a, b) {
                    return b.age - a.age;
                });
                break;
            default:
                break;
        }
    }
}

export default CardsModel