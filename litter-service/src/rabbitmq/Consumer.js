import amqplib from 'amqplib'

/**
 * Represents a consumer.
 */
export class Consumer {
  /**
   * Instanciates consumer.
   *
   * @param {*} io - The server.
   */
  constructor (io) {
    this.io = io
  }

  /**
   * Consumes messages.
   */
  async consumeMessages () {
    try {
      console.log('Attempting to connect to RabbitMQ...')
      const connection = await amqplib.connect({
        protocol: process.env.RABBITMQ_PROTOCOL,
        hostname: process.env.RABBITMQ_HOST,
        port: process.env.RABBITMQ_PORT,
        username: process.env.RABBITMQ_USERNAME,
        password: process.env.RABBITMQ_PASSWORD
      })
      console.log('Connected to RabbitMQ')

      const channel = await connection.createChannel()

      const queue = await channel.assertQueue(process.env.RABBITMQ_QUEUE_NAME, { durable: false })
      console.log('Consuming messages')

      channel.consume(queue.queue, (message) => {
        const litMessage = Buffer.from(message.content, 'utf-8').toString()

        console.log('LITTER SERVICE HAS RECEIVED MESSAGE: ', litMessage)

        // Emit the message to the frontend using socket.io
        const jsonMessage = JSON.parse(litMessage)
        this.io.emit('message', jsonMessage)

        channel.ack(message)
      })
    } catch (error) {
      console.log('Error from RabbitMQ consumer: ', error)
    }
  }
}
