import type { GetStaticPaths, GetStaticPathsResult, GetStaticProps, GetStaticPropsResult, NextPage } from "next";
import { Grid, Image } from "semantic-ui-react";

import { Book } from "../types";
import Layout from "../components/Layout";
import Link from "next/link";
import { getKnex } from "../db";

interface HomeProps {
    books: Book[];
}

const Home: NextPage<HomeProps> = ({ books }) => {
    return (
        <Layout>
            <Grid doubling columns={2}>
                {books.map((b) => (
                    <Grid.Column key={b.id}>
                        <Link href={`/book/${b.id}`} passHref>
                            <Image src={b.cover_image_url} alt={b.title} />
                        </Link>
                    </Grid.Column>
                ))}
            </Grid>
        </Layout>
    );
};

export default Home;

export const getStaticProps: GetStaticProps<HomeProps> = async (): Promise<GetStaticPropsResult<HomeProps>> => {
    const knex = getKnex();
    const data = await knex<Book>("Book").withSchema("kidio").orderBy("title");
    return {
        props: {
            books: data
        }
    };
};
