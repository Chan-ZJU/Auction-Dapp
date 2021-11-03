import { tsPropertySignature } from "@babel/types";
import React from "react";
import { Button, Card, Icon, Image, Statistic } from "semantic-ui-react";

const Home = (props) => (
  <Card>
    <p>your account: {props.account}</p>
    <div>
      <p>hello {props.account}</p>
    </div>
  </Card>
);

export default Home;
