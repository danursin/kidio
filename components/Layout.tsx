import { Grid, Header, Menu } from "semantic-ui-react";

import Head from "next/head";
import { ReactNode } from "react";

interface LayoutProps {
    title?: string;
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title = "Kidio", children }) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content="Read-aloud books for kids" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Menu fluid tabular>
                <Menu.Item content={<Header content="Kidio" color="purple" icon="child" />} position="left" />
            </Menu>
            <Grid padded="horizontally" centered>
                <Grid.Column largeScreen={8} tablet={12} mobile={16}>
                    {children}
                </Grid.Column>
            </Grid>
        </>
    );
};

export default Layout;
