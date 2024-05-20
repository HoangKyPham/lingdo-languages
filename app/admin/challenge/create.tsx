import { Create, NumberInput, ReferenceField, SelectInput, SimpleForm, TextInput, required } from "react-admin"


export const ChallengeCreate = () => {
    return (
        <Create>
            <SimpleForm  >
                <TextInput  source="question" validate={[required()]} label="question" />
                <SelectInput
                    source="type"
                    choices={[
                        {
                            id: "SELECT",
                            name: "SELECT"
                        },
                        {
                            id : "ASSIST",
                            name: "ASSIST"
                        }
                    ]}
                    validate={[required()]}
                />
                <ReferenceField source="lessonId" reference="lessons" />
                <NumberInput source="order" validate={[required()]} label="Order" />
            </SimpleForm>
        </Create>
    )
}