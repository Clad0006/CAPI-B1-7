import React from "react";
import { Route, Switch } from "wouter";
import HomeView from "../views/HomeView";
import NotFoundView from "../views/NotFoundView.jsx";
import PokerView from "../views/PokerView.jsx";
import PlayersView from "../views/PlayersView.jsx";



function Router() {
    return (
        <Switch>

            <Route path="/">
                <HomeView />
            </Route>

            <Route path="/poker">
                <PokerView />
            </Route>


            <Route component={NotFoundView} />
        </Switch>
    );
}

export default Router;
