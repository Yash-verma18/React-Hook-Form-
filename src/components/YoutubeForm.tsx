import { useForm, useFieldArray } from "react-hook-form";

import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";
let renderCount = 0;

type FormValues = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumbers: string[];
  phNumbers: {
    number: string;
  }[];
  age: number;
  dob: Date;
};

// useFeidArray works only with object values, that is why phNumbers is an array of objects, and each object contains a property called number, where we will store the phone number value

export const YoutubeForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      username: "Batman",
      email: "",
      channel: "",
      social: {
        twitter: "",
        facebook: "",
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: "" }],
      age: 0,
      dob: new Date(),
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
  } = form;

  // getValues is a function that will return the current value of the form fields, unlike watch this will not re-render the component when the value of the watched field changes,

  const { errors, touchedFields, dirtyFields, isDirty } = formState;

  // touched : user has focused on the field and then moved away from it
  console.log("touched", touchedFields);

  // dirty : user has typed something in the field or modified the value of the field this value is compared with the default value of the field.
  console.log("dirty", dirtyFields);
  console.log("isDirty", isDirty);

  const onSubmit = (data: FormValues) => {
    // handle submit allows us to get the latest value of data from the form
    console.log("form submitted", data);
  };

  // Lets invoke the useFieldArray hook
  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    // control is getting the control property from the useForm hook
    control,
  });

  // const userWatch = watch("username");
  // const userWatch = watch(["username", "email"]);
  // const watchForm = watch();

  renderCount++;

  // useEffect(() => {
  //   const subscription = watch((value) => {
  //     console.log(value);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  const handleGetValues = () => {
    // console.log("get values", getValues());

    // to log only selected values :
    console.log("get values of username", getValues("username"));
    console.log("get values of username", getValues(["username", "channel"]));
  };

  const handleSetValue = () => {
    setValue("username", "Bruce Wayne");

    // use istouched or isDirty to check if the field has been touched or not
    // setValue("username", "Bruce Wayne", {
    //   shouldValidate: true,
    //   shouldDirty: true,
    //   shouldTouch: true,
    // });
  };

  return (
    <div>
      <h2>Youtube Form ({renderCount / 2}) </h2>
      {/* <h2>Watched Value {JSON.stringify(watchForm)}</h2> */}

      {/* no validate form attribute will prevent the default browser validation and allowing react hook form to handle the validation on thet field  */}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control">
          <label htmlFor="username">Username </label>
          <input
            type="text"
            id="username"
            {...register("username", {
              required: "Username is required",
            })}
          />

          <p className="error">{errors.username?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="email"> Email </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "invalid email address",
              },
              //  the function automatically receives the value of the input as the first argument
              // validate: (fieldValue) => {
              //   return (
              //     fieldValue !== "admin@example.com" ||
              //     "Enter a different email address"
              //   );
              // },

              // the validate feild can also be an object
              validate: {
                notAdmin: (fieldValue) => {
                  return (
                    fieldValue !== "admin@example.com" ||
                    "Enter a different email address"
                  );
                },
                notBlacklisted: (fieldValue) => {
                  return (
                    !fieldValue.endsWith("baddomain.com") ||
                    "This domain is not supported"
                  );
                },
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register("channel", {
              // you can also use the required attribute like this
              // required: "Channel is required",
              required: {
                value: true,
                message: "Channel is required",
              },
            })}
          />

          <p className="error">{errors.channel?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="twitter">Twitter</label>
          <input type="text" id="twitter" {...register("social.twitter")} />
        </div>
        <div className="form-control">
          <label htmlFor="facebook">Facebook</label>
          <input type="text" id="facebook" {...register("social.facebook")} />
        </div>
        <div className="form-control">
          <label htmlFor="primary-phone">Primary Phone Number</label>
          <input
            type="text"
            id="primary-phone"
            {...register("phoneNumbers.0")}
          />
        </div>
        <div className="form-control">
          <label htmlFor="secondary-phone">Secondary Phone Number</label>
          <input
            type="text"
            id="secondary-phone"
            {...register("phoneNumbers.1")}
          />
        </div>

        <div>
          <label>List of phone numbers</label>
          <div>
            {/* we are using the map function to loop through the fields array and render the input fields */}
            {fields.map((field, index) => {
              return (
                <div className="form-control" key={field.id}>
                  <input
                    type="text"
                    {...register(`phNumbers.${index}.number` as const)}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        // this will remove the entry from our phnumbers array
                        remove(index);
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => {
                // this will add a new entry into our phnumbers array
                append({ number: "" });
              }}
            >
              Add Phone Number
            </button>
          </div>
        </div>

        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            {...register("age", {
              valueAsNumber: true,
              required: {
                value: true,
                message: "Age is required",
              },
            })}
          />

          <p className="error">{errors.age?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="dob">DOB</label>
          <input
            type="date"
            id="dob"
            {...register("dob", {
              valueAsDate: true,
              required: {
                value: true,
                message: "Dob is required",
              },
            })}
          />

          <p className="error">{errors.dob?.message}</p>
        </div>

        <button>Submit</button>
        <button
          type="button"
          onClick={() => {
            handleGetValues();
          }}
        >
          Get Values
        </button>
        <button
          type="button"
          onClick={() => {
            handleSetValue();
          }}
        >
          Set Value
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
};
