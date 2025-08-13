import { app } from './app'

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`🚀 Server is running at port 3000`)
})
