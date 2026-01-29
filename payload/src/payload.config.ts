import { buildConfig } from 'payload/config'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { slateEditor } from '@payloadcms/richtext-slate'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import path from 'path'
import dotenv from 'dotenv'

import Users from './collections/Users'
import Posts from './collections/Posts'
import Media from './collections/Media'

dotenv.config()

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    meta: {
      titleSuffix: ' - Bonu CMS',
    },
  },
  editor: slateEditor({}),
  collections: [Users, Posts, Media],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  cors: ['http://localhost:3000', 'https://bonu.chartedconsultants.com'],
  csrf: ['http://localhost:3000', 'https://bonu.chartedconsultants.com'],
})
