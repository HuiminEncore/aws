import { IoTDataPlaneClient, UpdateThingShadowCommand, PublishCommand } from "@aws-sdk/client-iot-data-plane"
import type { Handler } from 'aws-lambda';

const iotClient = new IoTDataPlaneClient({ region: "eu-north-1" })

export const handler: Handler = async (event) => {
    const { deviceId, action, payload } = JSON.parse(event.body)

    try {
        switch (action) {
            case 'updateConfig':
                const shadowState = {
                    state: {
                        desired: {
                            config: payload
                        }
                    }
                }

                await iotClient.send(new UpdateThingShadowCommand({
                    thingName: deviceId,
                    payload: Buffer.from(JSON.stringify(shadowState))
                }))
                break

            case 'sendDownlink':
                await iotClient.send(new PublishCommand({
                    topic: `lorawan/${deviceId}/down/push`,
                    payload: JSON.stringify({
                        downlinks: [{
                            f_port: payload.fPort,
                            frm_payload: payload.data,
                            priority: "NORMAL"
                        }]
                    })
                }))
                break
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Command sent successfully' })
        }
    } catch (error) {
        console.error('Error:', error)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: (error as Error).message })
        }
    }
}