import { Create, NumberInput, ReferenceField, ReferenceInput, SelectInput, SimpleForm, TextInput, required } from "react-admin"


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
                <ReferenceInput source="activeLesson" reference="lessons" />
                <NumberInput min={1} source="order" validate={[required()]} label="Order" />
            </SimpleForm>
        </Create>
    )
}