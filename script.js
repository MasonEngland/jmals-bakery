// all variables are declared

let cakeCounter = document.getElementById('cake-count');
let moneyCounter = document.getElementById('money-count');
let bagelCounter = document.getElementById('bagel-count');
let ovenUpgradeButton = document.getElementById('oven-upgrader');
let cakeAmount = 0;
let money = 0;
let inflation = 1;
let globalDemand = 1;
let hungryRate = 10000;
let bakeAmount = 1;
let autoBakeAmount = 0;
let bagelAmount = 0;
let bagelAddAmount = 0;
let bagelWait = 0;
let updatePrice = 3000;
let updateModifier = 1;
let randomRange = 7;

// the blueprint for a customer

class Customer {
    constructor(name, payAmount, id, demand, bagelWant) {
        this.id = id;
        this.name = name;
        this.pay = payAmount;
        this.loss = 1 * inflation;
        this.hungry = false;
        this.demand = globalDemand * demand;
        this.bagelDemand = 0;
        this.bagelsWanted = bagelWant;
        this.hungerCheck = false;
        this.patients = true;
    }
    getHungry() {
        this.bagelDemand = Math.ceil(this.bagelDemand * globalDemand);
        this.demand = Math.ceil(this.demand * globalDemand);
        this.pay = Math.ceil(this.pay * inflation);
        this.hungry = true;
    }
    losePatients() {
        if (this.patients == false) {
            money -= this.loss;
            document.getElementById(this.id).remove();
        }
    }
    serve() {
        if (cakeAmount >= this.demand && bagelAmount >= this.bagelDemand) {
            bagelAmount -= this.bagelDemand;
            this.hungry = false;
            this.served = true;
            document.getElementById(this.id).remove();
            document.getElementById(this.id + 'break').remove();
            cakeAmount -= this.demand;
            money += this.pay;
            inflation += 0.1;
            globalDemand += 0.1;
            this.hungerCheck = false;
            this.patients = true;
            bagelWait += 1;
        }
        
    }
    wantsBagels() {
        if (bagelWait >= 20) {
            return true;
        }
        return false;
    }
}

// the blueprint for an upgrade

class Upgrade {
    constructor(name, id, cost, requirement, hungerLoss, effect, extraRequirement) {
        this.name = name;
        this.id = id;
        this.cost = cost;
        this.requirement = requirement;
        this.purchased = false;
        this.unlocked = false;
        this.purchase = () => {
            if (money >= this.cost) {
                this.purchased = true;
                money -= this.cost;
                hungryRate -= hungerLoss;
                effect();
                globalDemand += 0.1;
                document.getElementById(this.id).remove();
                document.getElementById(this.id + 'break').remove();
                return true;
            }
            return false;
        }
        this.unlock = () => {
            if (money >= this.requirement && extraRequirement() && !this.unlocked) {
                this.unlocked = true;
                return true;
            }
            return false;
        }
    }
}

// runs every frame

function update() {
    cakeCounter.textContent = "cupcakes: " + Math.floor(cakeAmount).toLocaleString('en-US');
    bagelCounter.textContent = "bagels: " + bagelAmount.toLocaleString();
    moneyCounter.textContent = "Money: $" + Math.floor(money).toLocaleString();
    ovenUpgradeButton.innerHTML = "upgrade auto oven<br>$" + Math.floor(updatePrice).toLocaleString(); 
    for (item of firstCust) {
        makeCustomer(item);
    }
    for (item of upgradeList) {
        makeUpgrade(item);
    }
    if (bagelAmount > 0) {
        bagelCounter.style.visibility = 'visible';
    }
}

// list of names customers can have

let nameList = [
    "john",
    "jeff",
    "sally",
    "sue",
    "la'quisha",
    "tyrone",
    "bobby"
]

// list of customers

const firstCust = [
    new Customer(nameList[0], 10.00, 'firstcus', 10, 1),
    new Customer(nameList[1], 15.00, 'secondcus', 20, 2),
    new Customer(nameList[2], 20.00, 'thirdcus', 30, 3),
    new Customer(nameList[4], 25.00, 'fourthcus', 40, 4),
    new Customer(nameList[3], 30.00, 'fifthcus', 80, 5),
    new Customer(nameList[5], 40.00, 'sixthcus', 100, 6),
    new Customer(nameList[6], 50.00, 'seventhcus', 500, 7)
]

// defines every upgrade

const extraEmployee = new Upgrade("New Employee", "new-employee", 30.00, 10, 500, () => bakeAmount = 2, () => {
    return true
});

const extraEmployee2 = new Upgrade("New Employee", "new-employee2", 100.00, 50, 500, () => bakeAmount = 10, () => {
    if (extraEmployee.purchased) {
        //hungryRate -= 1000;
        return true;
    }
    return false;
});

const extraEmployee3 = new Upgrade("New Employee", "new-employee3", 300.00, 100, 500, () => bakeAmount = 50, () => {
    if (extraEmployee2.purchased) {
        //hungryRate -= 1000;
        return true;
    }
    return false;
})

const extraEmployee4 = new Upgrade("New Employee", "new-employee", 500.00, 500, 500, () => bakeAmount = 100, () => {
    if (extraEmployee3.purchased) {
        //hungryRate -= 500;
        return true;
    }
    return false;
})

const autoOven = new Upgrade("Auto Oven", "auto-oven", 500.00, 150, 500, () => autoBakeAmount += 1, () => {
    //hungryRate -= 1000;
    return true;
})

const autoOven2 = new Upgrade("Auto Oven", "auto-oven2", 1000.00, 500, 500, () => autoBakeAmount += 4, () => {
    if (autoOven.purchased) {
        //hungryRate -= 1000;
        return true;
    }
    return false;
})

const mechanic = new Upgrade("Mechanic", "mechanic", 5000, 0, 500, () => {
    document.getElementById('oven-upgrader').style.visibility = 'visible';
}, () => {
    if (autoOven2.purchased) {
        //hungryRate -= 500;
        return true;
    }
    return false;
})

const bagelMachine = new Upgrade("Bagel Machine", "bagel-machine", 2000.00, 1000, 500, () => bagelAddAmount = 1, () => {
    if (extraEmployee3.purchased) {
        //hungryRate -= 1000;
        return true;
    }
    return false;
})

const bagelMachine2 = new Upgrade("Bagel Machine II", "bagel-machine2", 3000, 0, 500, () => bagelAddAmount = 10, () => {
    if (bagelMachine.purchased) {
        //hungryRate -= 500;
        return true;
    }
    return false;
})

const drugs = new Upgrade("Drug Customers", "drug-customers", 5000, 0, 0, () => { hungryRate = 1000 }, () => {
    if (mechanic.purchased) {
        return true;
    }
    return false;
})

// kills bobby

const killBobby = new Upgrade("KILL BOBBY!<br>(no one will know)", "kill-bobby", 10000, 5000, 0, () => {
    firstCust.pop();
    firstCust.push(new Customer("Bill", 500, 'sevethcus', 500, 10));
    randomRange -= 1;
}, () => {
    if (bagelWait >= 30 && firstCust[6].hungry == false) {
        return true;
    }
    return false;
})

const killAppetites = new Upgrade("Slow Apatite", "lower-appatite", 10000, 0, 0, () => globalDemand = 1, () => {
    if (bagelMachine2.purchased) {
        return true;
    }
    return false;
})

// list of upgrades

const upgradeList = [
    extraEmployee,
    extraEmployee2,
    extraEmployee3,
    extraEmployee4,
    autoOven,
    autoOven2,
    mechanic,
    bagelMachine,
    bagelMachine2,
    drugs,
    killBobby,
    killAppetites
]

// makes the cutumers hungry, runs every second

function makeHungry() {
    let rnd = Math.floor(Math.random() * randomRange);
    if (firstCust[rnd].hungerCheck == false) {
        firstCust[rnd].getHungry();
        firstCust[rnd].hungerCheck = true;
    }
    setTimeout(makeHungry, hungryRate);
}

// adds cake when the cupcake is pressed

function makeCake() {
    cakeAmount += bakeAmount;
}

// creates a button for each customer if they get hungry

function makeCustomer(customer) {
    let index = firstCust.indexOf(customer);
    if (customer.hungry && customer.wantsBagels() == false) {
        customer.patients = false;
        setTimeout(customer.losePatients, 20000);
        document.getElementById('customers').innerHTML += '<button id="' + firstCust[index].id + '" onclick="' + 'firstCust[' + index + ']' + '.serve()">' + customer.name + '<br /> ' + 'wants: ' + customer.demand.toLocaleString() + ' cupcakes' + '<br />' + '+$' + customer.pay.toLocaleString() + '</button> <br id="' + customer.id + 'break' + '" />';
        customer.hungry = false;
    }
    else if (customer.hungry && customer.wantsBagels() == true) {
        document.getElementById('bagel-button').style.visibility = 'visible';
        customer.bagelDemand += customer.bagelsWanted;
        customer.patients = false;
        setTimeout(customer.losePatients, 20000);
        document.getElementById('customers').innerHTML += '<button id="' + firstCust[index].id + '" onclick="' + 'firstCust[' + index + ']' + '.serve()">' + customer.name + '<br /> ' + 'wants: ' + customer.demand.toLocaleString() + ' cupcakes, ' + customer.bagelDemand.toLocaleString() + ' Bagels' + '<br />' + '+$' + customer.pay.toLocaleString() + '</button> <br id ="' + customer.id + 'break' + '"/>';
        customer.hungry = false;
    }
    
}

// makes upgrade appear

function makeUpgrade(upgrade) {
    let index = upgradeList.indexOf(upgrade);
    if (upgrade.unlock()) {
        console.log(upgrade);
        document.getElementById('upgrades-section').innerHTML += '<button id="' + upgrade.id + '" onclick ="upgradeList[' + index + '].purchase()">' + upgrade.name + '<br /> $' + upgrade.cost.toLocaleString() + '</button><br id="' + upgrade.id + 'break' + '"/>';
    }
}

// generates cupcakes automatically

function autoBake() {
    cakeAmount += autoBakeAmount;
}

// generates bagels automatically

function makeBagel() {
    bagelAmount += bagelAddAmount;
}

function makeNormalBagel() {
    if (cakeAmount >= 5000) {
        cakeAmount -= 5000;
        bagelAmount += 1;
    }
}

// kills you

function selfDestruct() {
    location.reload();
}

function updateOven() {
    if (money >= updatePrice) {
        money -= updatePrice;
        autoBakeAmount += 30 * updateModifier;
        updateModifier += 0.1;
        updatePrice *= updateModifier;
    }
}

// calls the functions

setInterval(makeBagel, 1000);
setInterval(autoBake, 100);
setTimeout(makeHungry, 5000);
setInterval(update);
