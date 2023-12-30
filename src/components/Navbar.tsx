import { Dropdown, Menu } from "semantic-ui-react";

import { Link } from "react-router-dom";
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar: React.FC = () => {
    const { user, logout } = useAuth0();

    return (
        <Menu color="purple" inverted tabular>
            <Menu.Item icon="child" content="Kidio" as={Link} to="/" />
            {user && <Menu.Item position="right" icon="logout" content="Logout" onClick={() => logout()} />}
        </Menu>
    );
};

export default Navbar;
