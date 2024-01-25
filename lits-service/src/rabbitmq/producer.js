import amqplib from 'amqplib'

/**
 *The producer of class RabbitMQ
 */
export class Producer {
  // channel

  /**
   * Publish message.
   *
   * @param {string} message - The message to send.
   */
  async publishMessage (message) {
    try {
      console.log('Attempting to connect to RabbitMQ...')
      const connection = await amqplib.connect({
        protocol: process.env.RABBITMQ_PROTOCOL,
        hostname: process.env.RABBITMQ_HOST,
        port: process.env.RABBITMQ_PORT,
        username: process.env.RABBITMQ_USERNAME,
        password: process.env.RABBITMQ_PASSWORD
      })
      console.log('Connected to rabbitMQ')
      const channel = await connection.createChannel()

      const queue = process.env.RABBITMQ_QUEUE_NAME
      await channel.assertQueue(queue, { durable: false })
      console.log('Ready to send messages')
      channel.sendToQueue(queue, Buffer.from(message))
      console.log('MESSAGE SENT TO QUEUE')
      await channel.close()
      await connection.close()
    } catch (error) {
      console.log('Error from RabbitMQ producer: ', error)
    }
  }
}
