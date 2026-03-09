import Time "mo:core/Time";
import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

actor {
  type Team = {
    name : Text;
    position : Nat;
    played : Nat;
    wins : Nat;
    draws : Nat;
    losses : Nat;
    goalsFor : Nat;
    goalsAgainst : Nat;
    goalDiff : Int;
    points : Nat;
  };

  type Prediction = {
    id : Nat;
    homeTeam : Text;
    awayTeam : Text;
    homeScore : Nat;
    awayScore : Nat;
    note : Text;
    timestamp : Time.Time;
  };

  let teams : [Team] = [
    { name = "Newcastle"; position = 1; played = 4; wins = 3; draws = 1; losses = 0; goalsFor = 14; goalsAgainst = 6; goalDiff = 8; points = 10 },
    { name = "Arsenal"; position = 2; played = 4; wins = 3; draws = 1; losses = 0; goalsFor = 11; goalsAgainst = 5; goalDiff = 6; points = 10 },
    { name = "Tottenham"; position = 3; played = 4; wins = 3; draws = 0; losses = 1; goalsFor = 10; goalsAgainst = 4; goalDiff = 6; points = 9 },
    { name = "West Ham"; position = 4; played = 4; wins = 2; draws = 2; losses = 0; goalsFor = 12; goalsAgainst = 9; goalDiff = 3; points = 8 },
    { name = "Brentford"; position = 5; played = 4; wins = 2; draws = 2; losses = 0; goalsFor = 3; goalsAgainst = 1; goalDiff = 2; points = 8 },
    { name = "Liverpool"; position = 6; played = 4; wins = 2; draws = 1; losses = 1; goalsFor = 10; goalsAgainst = 4; goalDiff = 6; points = 7 },
    { name = "Chelsea"; position = 7; played = 4; wins = 2; draws = 1; losses = 1; goalsFor = 10; goalsAgainst = 8; goalDiff = 2; points = 7 },
    { name = "Man City"; position = 8; played = 4; wins = 2; draws = 0; losses = 2; goalsFor = 6; goalsAgainst = 4; goalDiff = 2; points = 6 },
    { name = "Nottingham"; position = 9; played = 4; wins = 2; draws = 0; losses = 2; goalsFor = 8; goalsAgainst = 10; goalDiff = -2; points = 6 },
    { name = "Southampton"; position = 10; played = 4; wins = 2; draws = 0; losses = 2; goalsFor = 6; goalsAgainst = 8; goalDiff = -2; points = 6 },
    { name = "Brighton"; position = 11; played = 4; wins = 2; draws = 0; losses = 2; goalsFor = 5; goalsAgainst = 8; goalDiff = -3; points = 6 },
    { name = "Wolves"; position = 12; played = 4; wins = 1; draws = 2; losses = 1; goalsFor = 5; goalsAgainst = 5; goalDiff = 0; points = 5 },
    { name = "Man United"; position = 13; played = 4; wins = 1; draws = 1; losses = 2; goalsFor = 4; goalsAgainst = 6; goalDiff = -2; points = 4 },
    { name = "Leeds"; position = 14; played = 4; wins = 1; draws = 1; losses = 2; goalsFor = 5; goalsAgainst = 8; goalDiff = -3; points = 4 },
    { name = "Fulham"; position = 15; played = 4; wins = 1; draws = 0; losses = 3; goalsFor = 6; goalsAgainst = 9; goalDiff = -3; points = 3 },
    { name = "Bournemouth"; position = 16; played = 4; wins = 0; draws = 3; losses = 1; goalsFor = 3; goalsAgainst = 6; goalDiff = -3; points = 3 },
    { name = "Aston Villa"; position = 17; played = 4; wins = 1; draws = 0; losses = 3; goalsFor = 7; goalsAgainst = 11; goalDiff = -4; points = 3 },
    { name = "Crystal Palace"; position = 18; played = 4; wins = 0; draws = 2; losses = 2; goalsFor = 3; goalsAgainst = 7; goalDiff = -4; points = 2 },
    { name = "Everton"; position = 19; played = 4; wins = 0; draws = 2; losses = 2; goalsFor = 3; goalsAgainst = 8; goalDiff = -5; points = 2 },
    { name = "Leicester"; position = 20; played = 4; wins = 0; draws = 1; losses = 3; goalsFor = 3; goalsAgainst = 7; goalDiff = -4; points = 1 },
  ];

  let predictions = List.empty<Prediction>();
  var nextPredictionId = 0;

  public query ({ caller }) func getTeams() : async [Team] {
    teams;
  };

  public shared ({ caller }) func savePrediction(homeTeam : Text, awayTeam : Text, homeScore : Nat, awayScore : Nat, note : Text) : async Nat {
    let newPrediction : Prediction = {
      id = nextPredictionId;
      homeTeam;
      awayTeam;
      homeScore;
      awayScore;
      note;
      timestamp = Time.now();
    };

    predictions.add(newPrediction);
    nextPredictionId += 1;
    newPrediction.id;
  };

  public query ({ caller }) func getPredictions() : async [Prediction] {
    predictions.toArray();
  };

  public shared ({ caller }) func deletePrediction(id : Nat) : async Bool {
    let existing = predictions.find(func(prediction) { prediction.id == id });
    switch (existing) {
      case (null) { Runtime.trap("Prediction does not exist") };
      case (?_) {
        let filtered = predictions.filter(func(p) { p.id != id });
        predictions.clear();
        predictions.addAll(filtered.values());
        true;
      };
    };
  };
};
