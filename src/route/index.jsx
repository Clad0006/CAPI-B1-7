import React from "react";
import { Route, Switch } from "wouter";
import HomeView from "../views/HomeView";
import NotFoundView from "../views/NotFoundView.jsx";


function Router() {
    return (
        <Switch>
            <Route path="/">
                <HomeView />
            </Route>

            <Route component={NotFoundView} />
        </Switch>
    );
}

export default Router;
