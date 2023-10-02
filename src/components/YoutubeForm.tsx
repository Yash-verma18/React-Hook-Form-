import { useForm } from "react-hook-form";

import { DevTool } from "@hookform/devtools";
let renderCount = 0;

type FormValues = {
  username: string;
  email: string;
  channel: string;
};

export const YoutubeForm = () => {
  const form = useForm<FormValues>({
    // defaultValues: {
    //   username: "Batman",
    //   email: "",
    //   channel: "",
    // },
    // what if we want to load already saved data from the api ?
    defaultValues: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users/1"
      );
      const data = await response.json();
      return {
        username: data.username,
        email: data.email,
        channel: "",
      };
    },
  });

  const { register, control, handleSubmit, formState } = form;

  const { errors } = formState;

  const onSubmit = (data: FormValues) => {
    // handle submit allows us to get the latest value of data from the form
    console.log("form submitted", data);
  };

  console.log("errors", errors);

  renderCount++;
  return (
    <div>
      <h2>Youtube Form ({renderCount / 2}) </h2>

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
        <button>Submit</button>
      </form>
      <DevTool control={control} />
    </div>
  );
};
