import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import React from "react";

const Navbar: React.FC = () => {
    return (
        <Menu color="purple" inverted tabular>
            <Menu.Item icon="child" content="Kidio" as={Link} to="/" />
        </Menu>
    );
};

export default Navbar;
