import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar: React.FC = () => {
    const { logout } = useAuth0();

    return (
        <Menu color="purple" inverted tabular>
            <Menu.Item icon="child" content="Kidio" as={Link} to="/" />
            <Menu.Item position="right" onClick={() => logout()} content="Logout" />
        </Menu>
    );
};

export default Navbar;
