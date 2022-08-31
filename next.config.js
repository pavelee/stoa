/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // this cause second render on dev eniorment! https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-strict-mode
  swcMinify: true,
}

module.exports = nextConfig
