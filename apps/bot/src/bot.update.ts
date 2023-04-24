import { Hears, Start, Update } from "nestjs-telegraf";

@Update()
export class AppUpdate {
    // @Hears('start')
    // onStart(): string {
    //     return 'started'
    // }

    @Start()
    onStart() : string {
        return
    }
}