var express = require('express');
var router = express.Router();
//  this is the package for working with the file system
const fs = require('fs')

//  arrays of people on the ship and the title of the columns
let titanic = [],
    headers = [];

//      Show the home
 page without data
router.get('/', function (req, res, next) {
    res.render('titanic/passengers', {
        passengers: [], //  no passengers will be listed
        headers: headers, //  lets show the headers though
        search: '' //  leave the search field empty
    });
});

//      Show the home page listing all passengers
router.get('/all', function (req, res, next) {

    let alive = 0;
    alive = titanic.reduce((total, t) => total + (t.survivor ? 1 : 0), 0);

    let dead = 0;
    dead = titanic.reduce((total, t) => total + (t.survivor ? 0 : 1), 0);

    res.render('titanic/passengers', {
        passengers: titanic, //  all passengers will be listed
        headers: headers, //  lets show the headers though
        search: '',
        survivors: alive,
        notSurvivors: dead
    });
});

//  35 points 
//  There is a small search form on the page.
//      the action for this first search field is search
//      the user can enter a passenger name to search
//  TODO 5  points get the name from the search field
//  TODO 10 points get the passengers that match that name
//  TODO 5  points get the survivors count
//  TODO 5  points get the perished count
//  TODO 10 points get the data to the passengers.pug page
//  put the data together and send to the passengers.pug page to be rendered
router.post('/search', function (req, res, next) {
    let search = req.body.search; //  TODO --- where will you find the search text from the browser?
    let list; //  this will be the variable that holds the results of your search

    list = titanic.filter(p => p.name.includes(search));
    //  filter out all passengers/crew whose name includes the value in the search variable
    //          TODO --- your code goes here

    //  TODO --- count the living and the dead
    let alive = -1; //  count the survivors
    alive = list.reduce((total, t) => total + (t.survivor ? 1 : 0), 0);
    let dead = -1; //  count the dead
    dead = list.reduce((total, t) => total + (t.survivor ? 0 : 1), 0);

    //  we will render the passengers page with the following data
    //      search the passengers.pug file for any references to data.
    //      you will see some tags using references like this: #{survivors}.
    //      that means you need to add to the JSON data an attribute called
    //              survivors:'some kind of data'
    res.render('titanic/passengers', {
        //      TODO this is where you will add your data
        //              look at lines 21-24 to get some idea
        passengers: list, //  show all passengers
        headers: headers, //  show the headers
        search: search, //  leave search field blank
        survivors: alive, //  survivors count
        notSurvivors: dead //  the honored dead
    });
});

//  30 points plus all the extra points you can earn from the SEARCH OPTIONS 
//  There is a second small search form on the page.
//      you will need to look at the passsengers.pug page to figure out
//      what the end point for that form will
//      the user can enter the passengers name to search for
//  Points
//      5  points name the endpoint correctly
//      5  points get the search term from the form
//      5  points for creating the switch statement 
//      5  points for each search option you define
//      5  points get the survivors/perished count. you already did this.
//      5  points get the data to the passengers.pug page (you did this already)
//  put the data together and send to the passengers.pug page to be rendered
router.post('/fancy', function (req, res, next) {
    let search = req.body.fancy; //  TODO --- where will you find the search text from the browser?
    let list; //  this will be the variable that holds the results of your search

    //  SEARCH OPTION IDEAS
    //  Each of these options are worth 5 points
    //  the user can enter something in the search field fancy like 
    //      underage:10         //  you will need to find all people under 10
    //      overage:50          //  find passengers over 50
    //      name:Henry          //  find all passengers with the name Henry
    //      crew:               //  list all crew members
    //      passengers:         //  list all passengers
    //      class:3rd           //  list all 3rd class passengers
    //      role:Musician       //  list all Muscians
    //      class:Victualling   //  list all Victualling staff
    //      role:Servant        //  list all Servants
    //          TODO --- your code goes here

    let ar = search.split(":"); 


    switch (ar[0]) {
        case "name":
            list = titanic.filter(p => p.name.includes(ar[1]));
            break;
        case "under":
            list = titanic.filter(p => p.age <= ar[1]);
            break;
        case "over":
            list = titanic.filter(p => p.age >= ar[1]);
            break;
        case "class":
            list = titanic.filter(p => p.passengerClass.includes(ar[1]));
            break;
        case "crew":
            list = titanic.filter(p => p.passengerCrew.includes("Crew"));
            break;
        case "passenger":
            list = titanic.filter(p => p.passengerCrew.includes("Passenger")); 
            break;
        case "role":
            list = titanic.filter(p => p.role.includes(ar[1]));
            break;
        defaut : 
        list = titanic.filter(p => p.passengers); 
        break;


    }



    //  TODO --- count the living and the dead
    let alive = -1; //  count the survivors
    alive = list.reduce((total, t) => total + (t.survivor ? 1 : 0), 0);
    let dead = -1; //  count the dead
    dead = list.reduce((total, t) => total + (t.survivor ? 0 : 1), 0);

    //  we will render the passengers page with the following data
    //      search the passengers.pug file for any references to data.
    //      you will see some tags using references like this: #{survivors}.
    //      that means you need to add to the JSON data an attribute called
    //              survivors:'some kind of data'
    res.render('titanic/passengers', {
        //      TODO this is where you will add your data
        passengers: list,
        headers: headers,
        fancy: search,
        survivors: alive,
        notSurvivors: dead
    });
});

module.exports = router;

//  The Passenger Object
class Passenger {
    constructor(Name, Age, PassengerClass, PassengerCrew, Role, Survivor) {
        this.name = Name; //  full name

        let temp = Name.split('/'); //  split the name on the first/last separator '/'
        this.lastName = temp[0]; //  the first token will be the last name
        if (temp.length > 1) //  if there is one more token
            this.firstName = temp[1]; //  it is the first name

        this.age = +Age; //  +Age will convert age to a number
        this.passengerClass = PassengerClass; //  1st, 2nd, 3rd...
        this.passengerCrew = PassengerCrew; //  'Passenger' or 'Crew'
        this.role = Role; //  secondary job (Delivery trip only), Servant, Musician
        this.survivor = Survivor == 'T'; //  True or False
    }
}

//  read the file like basic text
//  titanic.csv is a comma separated variable file (fields are separated by commas)
//  it is a listing of all passengers and crew from the Titanic. 
//  Including those that show up for work and those that got on just to cross over to SouthHampton
fs.readFile('/projects/csv/titanic.csv', {
    encoding: 'utf-8'
}, (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    //  The text we received is one LARGE text string
    //  each line is separated by a CR LF
    //  split the large text string into individual lines
    let lines = data.split('\r\n');

    //  grab the first row. It is the headings for the column names
    //  SHIFT the FIRST element of the array off of the passenger names array
    //  it contains the column names as a string
    //      "Last Name,First Name,Age,Class,Passenger or Crew,Role,Survivor"
    //  Split on , to get an array of the column names
    //      ['Last Name', 'First Name', 'Age', 'Class', 'Passenger or Crew', 'Role', 'Survivor']
    //  we will use them to display on the web page <th> tag in the table
    headers = lines.shift().split(',');

    //  Each line represents a passenger or crew member on the ship
    //      "BROWN/ Mrs Margaret ,44,1st Class,Passenger,,T"
    for (let line of lines) {
        //  split the line on , to get the individual attributes into an array
        //      [BROWN/ Mrs Margaret ', '44', '1st Class', 'Passenger', '', 'T']
        //      This BTW is the famous 'Molly' Brown as in the 'Unsinkable Molly Brown'
        let attributes = line.split(',');

        //  create a passenger using the data from the text file
        //                         Name,          Age,           Class,      Passenger or Crew, Role,        Survivor
        let person = new Passenger(attributes[0], attributes[1], attributes[2], attributes[3], attributes[4], attributes[5]);

        //  save each passenger and crew member to the titanic manifest
        titanic.push(person);
    }
});