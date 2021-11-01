import React from "react";
import {Button,Card,Icon, Image,Statistic} from 'semantic-ui-react'

const Home = (props) => (
    <Card>
        <h1l>hello world</h1l>
        <p>your account: {props.account},{props.account2}</p>
        <p>version: {props.version}</p>
    </Card>
)

export default Home